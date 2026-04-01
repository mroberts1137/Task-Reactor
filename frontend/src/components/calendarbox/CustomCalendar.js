import { useState, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';

// ─── Theme ────────────────────────────────────────────────────────────────────
const lightTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    danger: '#C54',
    dangerHover: '#CCC',
    success: '#28a745',
    white: '#ffffff',
    primaryDark: '#1565c0',
    surface: '#FAFAFA',
    border: '#e0e0e0',
    header: '#f8f9fa',
    text: {
      primary: '#212121',
      secondary: '#757575',
      success: '#ffffff',
      warning: '#ffffff'
    },
    table: {
      headerBackground: '#f5f5f5',
      oddRow: '#ffffff',
      evenRow: '#f9f9f9',
      hover: '#f5f5f5'
    },
    card: { background: '#f8f9fa' }
  },
  shadows: { card: '0 2px 10px rgba(0,0,0,0.1)' },
  borderRadius: '8px',
  transitions: { default: 'all 0.3s ease' }
};
const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#90caf9',
    secondary: '#b0bec5',
    background: '#121212',
    danger: '#f44336',
    dangerHover: '#d32f2f',
    surface: '#1e1e1e',
    border: '#333333',
    header: '#1a1a1a',
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
      success: '#ffffff',
      warning: '#ffffff'
    },
    table: {
      headerBackground: '#2c2c2c',
      oddRow: '#1e1e1e',
      evenRow: '#252525',
      hover: '#2c2c2c'
    },
    card: { background: '#f8f9fa' }
  },
  shadows: { card: '0 2px 10px rgba(255,255,255,0.1)' }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// ─── Styled components ────────────────────────────────────────────────────────

const CalendarWrap = styled.div`
  font-family: courier, sans-serif;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  user-select: none;
`;

const CalendarCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.header};
  box-shadow: 0 1px 3px -2px black;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  line-height: 1;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.table.hover};
  }
`;

const NavBtnSmall = styled(NavBtn)`
  font-size: 1rem;
  padding: 0.25rem 0.4rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;
const HeaderTitle = styled(NavBtn)`
  font-size: 1.1rem;
  font-weight: 600;
`;

const TodayBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  line-height: 1;
  font-family: courier, sans-serif;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TodayButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.62rem;
  font-family: courier, sans-serif;
  cursor: pointer;
  padding: 0.1rem 0.55rem;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DayHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 8px 8px 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 0;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 4px 8px 8px;
  background: ${({ theme }) => theme.colors.surface};
`;

const DayCell = styled.div`
  min-height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: ${({ $isSelected, theme }) =>
    $isSelected
      ? `2px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.border}`};
  padding: 6px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
  transition: ${({ theme }) => theme.transitions.default};
  opacity: ${({ $isNeighbor }) => ($isNeighbor ? 0.4 : 1)};
  background: ${({ $bg, $isSelected, $isToday, theme }) => {
    if ($isSelected) return theme.colors.primary;
    if ($isToday) return theme.colors.primary + '33';
    return $bg || theme.colors.table.oddRow;
  }};
  &:hover {
    filter: brightness(0.92);
  }
`;

const DateNumber = styled.span`
  font-size: 0.8rem;
  font-weight: bold;
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.white : theme.colors.text.primary};
`;

const CellContent = styled.span`
  font-size: 1rem;
  font-weight: 600;
  align-self: center;
  text-align: center;
  width: 100%;
  color: ${({ $isSelected, $contentColor, theme }) =>
    $isSelected
      ? theme.colors.white
      : $contentColor || theme.colors.text.primary};
`;

const CalendarFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.header};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CalendarLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.65rem;
  background: ${({ theme }) => theme.colors.table.headerBackground};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LegendDot = styled.span`
  width: 13px;
  height: 13px;
  border-radius: 3px;
  background: ${({ $bg }) => $bg};
  display: inline-block;
  margin-right: 3px;
  vertical-align: middle;
  border: ${({ $border }) => $border || 'none'};
`;

const PickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface};
`;

const PickerCell = styled.div`
  padding: 14px 0;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  transition: ${({ theme }) => theme.transitions.default};
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.table.oddRow};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : theme.colors.text.primary};
  &:hover {
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.table.hover};
  }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC CALENDAR COMPONENT
//
// Props:
//   selectedDate   : Date                             – controlled selected date
//   onDateSelect   : (date: Date) => void             – called on day click
//   getDayProps    : (date: Date) => {                – optional: per-day customisation
//                      cellBg?     : string           –   full-cell background color
//                      content?    : React.ReactNode  –   rendered inside the cell
//                      contentColor?: string          –   text/icon color for content
//                    }
//   legend         : { bg: string, border?: string,   – optional: legend items
//                      label: string }[]
// ═══════════════════════════════════════════════════════════════════════════════
function Calendar({ selectedDate, onDateSelect, getDayProps, legend }) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [view, setView] = useState('month');

  const prevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevYear = () =>
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  const nextYear = () =>
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  const prevDecade = () =>
    setViewDate(new Date(viewDate.getFullYear() - 10, 0, 1));
  const nextDecade = () =>
    setViewDate(new Date(viewDate.getFullYear() + 10, 0, 1));

  const goToToday = () => {
    const now = new Date();
    onDateSelect(now);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setView('month');
  };

  const drillUp = () => {
    if (view === 'month') setView('year');
    else if (view === 'year') setView('decade');
  };

  const calDays = useMemo(() => {
    const firstDay = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0
    ).getDate();
    const prevMonthDays = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      0
    ).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--)
      cells.push({
        date: new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() - 1,
          prevMonthDays - i
        ),
        neighbor: true
      });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({
        date: new Date(viewDate.getFullYear(), viewDate.getMonth(), d),
        neighbor: false
      });
    while (cells.length % 7 !== 0)
      cells.push({
        date: new Date(
          viewDate.getFullYear(),
          viewDate.getMonth() + 1,
          cells.length - daysInMonth - firstDay + 1
        ),
        neighbor: true
      });
    return cells;
  }, [viewDate]);

  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;
  const prevAction =
    view === 'month' ? prevMonth : view === 'year' ? prevYear : prevDecade;
  const nextAction =
    view === 'month' ? nextMonth : view === 'year' ? nextYear : nextDecade;
  const titleLabel =
    view === 'month'
      ? `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`
      : view === 'year'
        ? `${viewDate.getFullYear()}`
        : `${decadeStart} – ${decadeStart + 9}`;

  const fmtDate = (d) =>
    d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

  return (
    <CalendarWrap>
      <CalendarCard>
        {/* Header */}
        <CalendarHeader>
          <NavGroup>
            {view === 'month' && (
              <NavBtnSmall onClick={prevYear} title='Previous year'>
                «
              </NavBtnSmall>
            )}
            <NavBtn
              onClick={prevAction}
              title={view === 'month' ? 'Previous month' : 'Previous'}
            >
              ‹
            </NavBtn>
          </NavGroup>
          <NavGroup>
            <HeaderTitle onClick={drillUp} title='Click to zoom out'>
              {titleLabel}
            </HeaderTitle>
            <TodayButton onClick={goToToday}>Today</TodayButton>
          </NavGroup>
          <NavGroup>
            <NavBtn
              onClick={nextAction}
              title={view === 'month' ? 'Next month' : 'Next'}
            >
              ›
            </NavBtn>
            {view === 'month' && (
              <NavBtnSmall onClick={nextYear} title='Next year'>
                »
              </NavBtnSmall>
            )}
          </NavGroup>
        </CalendarHeader>

        {/* Month view */}
        {view === 'month' && (
          <>
            <DayHeaderRow>
              {DAYS.map((d) => (
                <DayLabel key={d}>{d}</DayLabel>
              ))}
            </DayHeaderRow>
            <DayGrid>
              {calDays.map(({ date, neighbor }, i) => {
                const isTdy = sameDay(date, today);
                const isSel = sameDay(date, selectedDate);
                const { cellBg, content, contentColor } =
                  (!neighbor && getDayProps?.(date)) || {};
                return (
                  <DayCell
                    key={i}
                    $isNeighbor={neighbor}
                    $isToday={isTdy}
                    $isSelected={isSel}
                    $bg={cellBg}
                    onClick={() => {
                      onDateSelect(date);
                      if (neighbor)
                        setViewDate(
                          new Date(date.getFullYear(), date.getMonth(), 1)
                        );
                    }}
                  >
                    <DateNumber $isSelected={isSel}>
                      {date.getDate()}
                    </DateNumber>
                    {content && !neighbor && (
                      <CellContent
                        $isSelected={isSel}
                        $contentColor={contentColor}
                      >
                        {content}
                      </CellContent>
                    )}
                  </DayCell>
                );
              })}
            </DayGrid>
          </>
        )}

        {/* Year picker */}
        {view === 'year' && (
          <PickerGrid>
            {MONTHS.map((m, i) => {
              const isActive =
                i === selectedDate.getMonth() &&
                viewDate.getFullYear() === selectedDate.getFullYear();
              return (
                <PickerCell
                  key={m}
                  $isActive={isActive}
                  onClick={() => {
                    setViewDate(new Date(viewDate.getFullYear(), i, 1));
                    setView('month');
                  }}
                >
                  {m.slice(0, 3)}
                </PickerCell>
              );
            })}
          </PickerGrid>
        )}

        {/* Decade picker */}
        {view === 'decade' && (
          <PickerGrid>
            {Array.from({ length: 10 }, (_, i) => decadeStart + i).map((yr) => (
              <PickerCell
                key={yr}
                $isActive={yr === selectedDate.getFullYear()}
                onClick={() => {
                  setViewDate(new Date(yr, viewDate.getMonth(), 1));
                  setView('year');
                }}
              >
                {yr}
              </PickerCell>
            ))}
          </PickerGrid>
        )}

        {/* Legend – only rendered if items are provided */}
        {legend?.length > 0 && (
          <CalendarLegend>
            {legend.map((item, i) => (
              <span key={i}>
                <LegendDot $bg={item.bg} $border={item.border} />
                {item.label}
              </span>
            ))}
          </CalendarLegend>
        )}

        {/* Footer */}
        <CalendarFooter>
          <span>
            Selected: <strong>{fmtDate(selectedDate)}</strong>
          </span>
          <span>
            Today: <strong>{fmtDate(today)}</strong>
          </span>
        </CalendarFooter>
      </CalendarCard>
    </CalendarWrap>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK APP – demo consumer of <Calendar />
// ═══════════════════════════════════════════════════════════════════════════════

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(v);

const TODAY = new Date();
const makeTask = (day, rate, hours, tax = 20) => {
  const gross = rate * hours,
    net = gross * (1 - tax / 100);
  return {
    startTime: new Date(TODAY.getFullYear(), TODAY.getMonth(), day, 9),
    netIncome: net
  };
};
const SAMPLE_TASKS = [
  makeTask(1, 80, 5),
  makeTask(2, 80, 3),
  makeTask(3, 80, 8),
  makeTask(5, 80, 6),
  makeTask(7, 80, 4),
  makeTask(8, 80, 7),
  makeTask(9, 80, 2),
  makeTask(10, 80, 9),
  makeTask(12, 80, 5),
  makeTask(14, 80, 6),
  makeTask(15, 80, 8),
  makeTask(16, 80, 3),
  makeTask(18, 80, 7),
  makeTask(19, 80, 5),
  makeTask(21, 80, 4),
  makeTask(22, 80, 6),
  makeTask(23, 80, 8),
  makeTask(TODAY.getDate(), 80, 5)
];
const DAILY_GOAL = 400;

const TASK_LEGEND = [
  { bg: '#22dd55', label: `Goal met (≥ ${formatCurrency(DAILY_GOAL)})` },
  { bg: '#22dd5528', border: '1px solid #22dd55', label: 'Earnings logged' },
  { bg: 'rgba(25,118,210,0.2)', label: 'Today' },
  { bg: '#1976d2', label: 'Selected' }
];

const ToggleButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.75rem;
  padding: 4px 10px;
  transition: ${({ theme }) => theme.transitions.default};
  margin-bottom: 8px;
  align-self: flex-end;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function App() {
  const [dark, setDark] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = dark ? darkTheme : lightTheme;

  // Build task map: "YYYY-M-D" -> net income
  const taskMap = useMemo(() => {
    const map = new Map();
    SAMPLE_TASKS.forEach((t) => {
      const d = new Date(t.startTime);
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(k, (map.get(k) || 0) + t.netIncome);
    });
    return map;
  }, []);

  // getDayProps: maps each date to cell bg, text content and content color
  const getDayProps = (date) => {
    const net =
      taskMap.get(
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      ) || 0;
    if (net <= 0) return {};
    const goalMet = net >= DAILY_GOAL;
    return {
      cellBg: goalMet ? '#22dd55' : '#22dd5528',
      content: formatCurrency(net),
      contentColor: goalMet ? '#155724' : '#28a745'
    };
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          background: theme.colors.background,
          padding: '2rem',
          transition: 'background 0.3s, color 0.3s'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 700,
            margin: '0 auto'
          }}
        >
          <ToggleButton onClick={() => setDark((d) => !d)}>
            {dark ? '☀ Light mode' : '🌙 Dark mode'}
          </ToggleButton>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            getDayProps={getDayProps}
            legend={TASK_LEGEND}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
