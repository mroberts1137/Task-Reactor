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
    text: { primary: '#212121', secondary: '#757575' },
    table: { headerBackground: '#f5f5f5', oddRow: '#ffffff', hover: '#f5f5f5' }
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
    text: { primary: '#ffffff', secondary: '#b0bec5' },
    table: { headerBackground: '#2c2c2c', oddRow: '#1e1e1e', hover: '#2c2c2c' }
  },
  shadows: { card: '0 2px 10px rgba(255,255,255,0.1)' }
};

// ─── Styled Components ────────────────────────────────────────────────────────
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
  padding: 0.3rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transitions.default};
  margin-left: 0.5rem;
  &:hover {
    filter: brightness(1.1);
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
const CellContent = styled.div`
  font-size: 1rem;
  font-weight: 600;
  align-self: center;
  text-align: center;
  width: 100%;
`;
const Footer = styled.div`
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

// ─── Generic Calendar Component ───────────────────────────────────────────────
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

function Calendar({
  selectedDate,
  onSelectDate,
  renderCellContent,
  getCellBackground,
  legendComponent
}) {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    new Date(
      (selectedDate || today).getFullYear(),
      (selectedDate || today).getMonth(),
      1
    )
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
    onSelectDate?.(now);
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

  const handleDayClick = (date, neighbor) => {
    onSelectDate?.(date);
    if (neighbor) setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  return (
    <CalendarWrap>
      <CalendarCard>
        <CalendarHeader>
          <NavGroup>
            {view === 'month' && (
              <NavBtnSmall onClick={prevYear} title='Previous year'>
                «
              </NavBtnSmall>
            )}
            <NavBtn onClick={prevAction}>‹</NavBtn>
          </NavGroup>
          <NavGroup>
            <HeaderTitle onClick={drillUp}>{titleLabel}</HeaderTitle>
            <TodayBtn onClick={goToToday}>Today</TodayBtn>
          </NavGroup>
          <NavGroup>
            <NavBtn onClick={nextAction}>›</NavBtn>
            {view === 'month' && (
              <NavBtnSmall onClick={nextYear} title='Next year'>
                »
              </NavBtnSmall>
            )}
          </NavGroup>
        </CalendarHeader>

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
                const isSel = selectedDate && sameDay(date, selectedDate);
                const bg =
                  !neighbor && getCellBackground
                    ? getCellBackground(date)
                    : undefined;
                return (
                  <DayCell
                    key={i}
                    $isNeighbor={neighbor}
                    $isToday={isTdy}
                    $isSelected={isSel}
                    $bg={bg}
                    onClick={() => handleDayClick(date, neighbor)}
                  >
                    <DateNumber $isSelected={isSel}>
                      {date.getDate()}
                    </DateNumber>
                    {!neighbor && renderCellContent && (
                      <CellContent>
                        {renderCellContent(date, isSel)}
                      </CellContent>
                    )}
                  </DayCell>
                );
              })}
            </DayGrid>
          </>
        )}

        {view === 'year' && (
          <PickerGrid>
            {MONTHS.map((m, i) => {
              const isActive =
                selectedDate &&
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

        {view === 'decade' && (
          <PickerGrid>
            {Array.from({ length: 10 }, (_, i) => decadeStart + i).map((yr) => (
              <PickerCell
                key={yr}
                $isActive={selectedDate && yr === selectedDate.getFullYear()}
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

        {legendComponent}

        <Footer>
          <span>
            📅 Selected:{' '}
            <strong>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'None'}
            </strong>
          </span>
          <span>
            📆 Today:{' '}
            <strong>
              {today.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </strong>
          </span>
        </Footer>
      </CalendarCard>
    </CalendarWrap>
  );
}

// ─── Earnings Tracker Implementation ──────────────────────────────────────────
const Legend = styled.div`
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
  border: ${({ $outlined }) => ($outlined ? '1px solid #22dd55' : 'none')};
`;

const TODAY = new Date();
const y = TODAY.getFullYear(),
  mo = TODAY.getMonth();
const makeTask = (day, rate, hours, tax = 20) => {
  const net = rate * hours * (1 - tax / 100);
  return {
    id: `task-${day}`,
    startTime: new Date(y, mo, day, 9),
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
const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(v);

function EarningsCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const taskMap = useMemo(() => {
    const map = new Map();
    SAMPLE_TASKS.forEach((t) => {
      const d = new Date(t.startTime);
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(k, (map.get(k) || 0) + t.netIncome);
    });
    return map;
  }, []);

  const getNet = (d) =>
    taskMap.get(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`) || 0;

  const renderCellContent = (date, isSelected) => {
    const net = getNet(date);
    if (net <= 0) return null;
    const goalMet = net >= DAILY_GOAL;
    const color = isSelected ? '#fff' : goalMet ? '#155724' : '#28a745';
    return <span style={{ color }}>{formatCurrency(net)}</span>;
  };

  const getCellBackground = (date) => {
    const net = getNet(date);
    if (net >= DAILY_GOAL) return '#22dd55';
    if (net > 0) return '#22dd5528';
    return undefined;
  };

  const legend = (
    <Legend>
      <LegendDot $bg='#22dd55' />
      Goal met (≥ {formatCurrency(DAILY_GOAL)})
      <LegendDot $bg='#22dd5528' $outlined />
      Earnings logged
      <LegendDot $bg='rgba(25,118,210,0.2)' />
      Today
      <LegendDot $bg='#1976d2' />
      Selected
    </Legend>
  );

  return (
    <Calendar
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      renderCellContent={renderCellContent}
      getCellBackground={getCellBackground}
      legendComponent={legend}
    />
  );
}

// ─── Demo App ─────────────────────────────────────────────────────────────────
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
  const theme = dark ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          background: theme.colors.background,
          padding: '2rem',
          transition: 'background 0.3s'
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
            {dark ? '☀ Light' : '🌙 Dark'}
          </ToggleButton>
          <EarningsCalendar />
        </div>
      </div>
    </ThemeProvider>
  );
}
