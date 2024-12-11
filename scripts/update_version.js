const fs = require('fs');
const path = require('path');

// Read version from root package.json
const getRootVersion = () => {
  const rootPackagePath = path.join(__dirname, '../package.json');
  if (!fs.existsSync(rootPackagePath)) {
    console.error('Root package.json not found');
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    const [major, minor, build] = (packageJson.version || '0.0.0').split('.');
    return {
      major: parseInt(major),
      minor: parseInt(minor),
      build: parseInt(build)
    };
  } catch (error) {
    console.error('Error reading root package.json:', error);
    process.exit(1);
  }
};

// Update package.json file with new version
const updatePackageJson = (filePath, version) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    packageJson.version = version;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    process.exit(1);
  }
};

// Validate version string if provided
const validateVersion = (version) => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  if (!versionRegex.test(version)) {
    console.error(
      'Invalid version format. Expected: major.minor.build (e.g., 0.1.5)'
    );
    process.exit(1);
  }
};

// Main function
const main = () => {
  // Get current version from root package.json
  const currentVersion = getRootVersion();
  let newVersionString;

  // If version argument provided, use it
  if (process.argv[2]) {
    newVersionString = process.argv[2];
    validateVersion(newVersionString);
  } else {
    // Increment build number
    currentVersion.build += 1;
    newVersionString = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.build}`;
  }

  // Update all package.json files
  const packagePaths = [
    path.join(__dirname, '../package.json'),
    path.join(__dirname, '../frontend', 'package.json'),
    path.join(__dirname, '../backend', 'package.json')
  ];

  for (const packagePath of packagePaths) {
    if (fs.existsSync(packagePath)) {
      updatePackageJson(packagePath, newVersionString);
    } else {
      console.warn(`Warning: ${packagePath} not found`);
    }
  }

  console.log(`Updated version to ${newVersionString}`);
};

// Run the script
try {
  main();
} catch (error) {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}
