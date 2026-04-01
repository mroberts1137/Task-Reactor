import { useState, useMemo } from 'react';
import styled from 'styled-components';

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

export default function Calendar({
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

  const isCurrentMonth =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth() &&
    view === 'month';

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
          {/* <NavGroup> */}
          <HeaderCenter>
            <HeaderTitle onClick={drillUp} title='Click to zoom out'>
              {titleLabel}
            </HeaderTitle>
            {!isCurrentMonth && (
              <TodayButton onClick={goToToday}>Today</TodayButton>
            )}
          </HeaderCenter>
          {/* </NavGroup> */}
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
  padding: 0.3rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: ${({ theme }) => theme.transitions.default};
  margin-left: 0.5rem;
  &:hover {
    filter: brightness(1.1);
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
