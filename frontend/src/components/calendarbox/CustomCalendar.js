import { useState, useMemo } from 'react';

// ---------- Types ----------
const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);

// ---------- Sample Data ----------
const TODAY = new Date();
const y = TODAY.getFullYear();
const m = TODAY.getMonth();

const makeTasks = (day, rate, hours, tax = 20) => {
  const start = new Date(y, m, day, 9, 0);
  const end = new Date(y, m, day, 9 + hours, 0);
  const duration = hours;
  const gross = rate * duration;
  const net = gross * (1 - tax / 100);
  return {
    id: `task-${day}`,
    title: 'Freelance Work',
    startTime: start,
    endTime: end,
    duration,
    hourlyRate: rate,
    taxRate: tax,
    grossIncome: gross,
    netIncome: net
  };
};

const SAMPLE_TASKS = [
  makeTasks(1, 80, 5),
  makeTasks(2, 80, 3),
  makeTasks(3, 80, 8),
  makeTasks(5, 80, 6),
  makeTasks(7, 80, 4),
  makeTasks(8, 80, 7),
  makeTasks(9, 80, 2),
  makeTasks(10, 80, 9),
  makeTasks(12, 80, 5),
  makeTasks(14, 80, 6),
  makeTasks(15, 80, 8),
  makeTasks(16, 80, 3),
  makeTasks(18, 80, 7),
  makeTasks(19, 80, 5),
  makeTasks(21, 80, 4),
  makeTasks(22, 80, 6),
  makeTasks(23, 80, 8),
  makeTasks(TODAY.getDate(), 80, 5)
];

const DAILY_GOAL = 400; // net $ per day

// ---------- Helpers ----------
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

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------- Calendar ----------
export default function TaskCalendar() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState('month'); // "month" | "year" | "decade"

  // Build task map: "YYYY-M-D" -> netIncome
  const taskMap = useMemo(() => {
    const map = new Map();
    SAMPLE_TASKS.forEach((t) => {
      if (!t.startTime) return;
      const d = new Date(t.startTime);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, (map.get(key) || 0) + t.netIncome);
    });
    return map;
  }, []);

  const getNet = (d) =>
    taskMap.get(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`) || 0;

  // --- Navigation ---
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

  const drillUp = () => {
    if (view === 'month') setView('year');
    else if (view === 'year') setView('decade');
  };

  // --- Month grid ---
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

  // --- Styles ---
  const s = {
    wrap: {
      fontFamily: 'Arial, Helvetica, sans-serif',
      width: '100%',
      maxWidth: 700,
      margin: '0 auto',
      userSelect: 'none'
    },
    card: {
      background: '#f6f4ea',
      border: '1px solid #b0c4de',
      borderRadius: 10,
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
    },
    header: {
      background: '#3a3f6b',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerBtn: {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: 20,
      cursor: 'pointer',
      padding: '4px 10px',
      borderRadius: 6,
      lineHeight: 1
    },
    headerTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: 6,
      border: 'none',
      background: 'transparent'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4,
      padding: 10,
      background: '#f6f4ea'
    },
    dayHeader: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 'bold',
      color: '#555',
      padding: '6px 0'
    },
    cell: (isNeighbor, isToday, isSelected, goalMet, net) => {
      let bg = '#fafafa';
      if (goalMet && !isNeighbor) bg = '#22dd55';
      else if (net > 0 && !isNeighbor) bg = '#d4f4dd';
      if (isSelected) bg = '#7780ff';
      if (isToday && !isSelected) bg = isNeighbor ? '#dde' : '#b6d8f4';
      return {
        minHeight: 80,
        background: bg,
        border: isSelected ? '2px solid #4a50cc' : '1px solid #ccc',
        borderRadius: 6,
        padding: '6px 8px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        transition: 'filter 0.15s',
        opacity: isNeighbor ? 0.4 : 1,
        boxSizing: 'border-box'
      };
    },
    dateNum: (isSelected) => ({
      fontSize: 15,
      fontWeight: 'bold',
      color: isSelected ? '#fff' : '#333'
    }),
    income: (isSelected, goalMet) => ({
      fontSize: 13,
      fontWeight: '600',
      marginTop: 4,
      alignSelf: 'center',
      color: isSelected ? '#fff' : goalMet ? '#155724' : '#2e7d32'
    }),
    // Year view
    yrGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8,
      padding: 16,
      background: '#f6f4ea'
    },
    yrCell: (isActive) => ({
      background: isActive ? '#7780ff' : '#fafafa',
      border: isActive ? '2px solid #4a50cc' : '1px solid #ccc',
      borderRadius: 8,
      padding: '14px 0',
      textAlign: 'center',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      color: isActive ? '#fff' : '#333',
      fontSize: 15,
      transition: 'background 0.15s'
    }),
    // Decade view
    decCell: (isActive) => ({
      background: isActive ? '#7780ff' : '#fafafa',
      border: isActive ? '2px solid #4a50cc' : '1px solid #ccc',
      borderRadius: 8,
      padding: '14px 0',
      textAlign: 'center',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      color: isActive ? '#fff' : '#333',
      fontSize: 15,
      transition: 'background 0.15s'
    }),
    // Info bar
    info: {
      background: '#3a3f6b',
      color: '#fff',
      padding: '8px 16px',
      fontSize: 14,
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    },
    legend: {
      display: 'flex',
      gap: 12,
      padding: '8px 14px',
      background: '#eee',
      flexWrap: 'wrap',
      alignItems: 'center',
      fontSize: 13,
      color: '#444'
    },
    dot: (bg) => ({
      width: 14,
      height: 14,
      borderRadius: 3,
      background: bg,
      display: 'inline-block',
      marginRight: 4
    })
  };

  const decadeStart = Math.floor(viewDate.getFullYear() / 10) * 10;

  // Selected day info
  const selNet = getNet(selectedDate);
  const selGoalMet = selNet >= DAILY_GOAL;

  const NavBtn = ({ onClick, children }) => (
    <button
      style={s.headerBtn}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.target.style.background = 'rgba(255,255,255,0.2)')
      }
      onMouseLeave={(e) => (e.target.style.background = 'transparent')}
    >
      {children}
    </button>
  );

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

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <NavBtn onClick={prevAction}>‹</NavBtn>
          <button
            style={s.headerTitle}
            onClick={drillUp}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            {titleLabel}
          </button>
          <NavBtn onClick={nextAction}>›</NavBtn>
        </div>

        {/* Month View */}
        {view === 'month' && (
          <div style={s.grid}>
            {DAYS.map((d) => (
              <div key={d} style={s.dayHeader}>
                {d}
              </div>
            ))}
            {calDays.map(({ date, neighbor }, i) => {
              const net = getNet(date);
              const goalMet = net >= DAILY_GOAL;
              const isTdy = sameDay(date, today);
              const isSel = sameDay(date, selectedDate);
              return (
                <div
                  key={i}
                  style={s.cell(neighbor, isTdy, isSel, goalMet, net)}
                  onClick={() => {
                    setSelectedDate(date);
                    if (neighbor)
                      setViewDate(
                        new Date(date.getFullYear(), date.getMonth(), 1)
                      );
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.filter = 'brightness(0.93)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter = 'brightness(1)')
                  }
                >
                  <span style={s.dateNum(isSel)}>{date.getDate()}</span>
                  {net > 0 && !neighbor && (
                    <span style={s.income(isSel, goalMet)}>
                      {formatCurrency(net)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Year View */}
        {view === 'year' && (
          <div style={s.yrGrid}>
            {MONTHS.map((mo, i) => {
              const isActive =
                i === selectedDate.getMonth() &&
                viewDate.getFullYear() === selectedDate.getFullYear();
              return (
                <div
                  key={mo}
                  style={s.yrCell(isActive)}
                  onClick={() => {
                    setViewDate(new Date(viewDate.getFullYear(), i, 1));
                    setView('month');
                  }}
                  onMouseEnter={(e) =>
                    !isActive && (e.currentTarget.style.background = '#e0e8ff')
                  }
                  onMouseLeave={(e) =>
                    !isActive && (e.currentTarget.style.background = '#fafafa')
                  }
                >
                  {mo.slice(0, 3)}
                </div>
              );
            })}
          </div>
        )}

        {/* Decade View */}
        {view === 'decade' && (
          <div style={s.yrGrid}>
            {Array.from({ length: 10 }, (_, i) => decadeStart + i).map((yr) => {
              const isActive = yr === selectedDate.getFullYear();
              return (
                <div
                  key={yr}
                  style={s.decCell(isActive)}
                  onClick={() => {
                    setViewDate(new Date(yr, viewDate.getMonth(), 1));
                    setView('year');
                  }}
                  onMouseEnter={(e) =>
                    !isActive && (e.currentTarget.style.background = '#e0e8ff')
                  }
                  onMouseLeave={(e) =>
                    !isActive && (e.currentTarget.style.background = '#fafafa')
                  }
                >
                  {yr}
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div style={s.legend}>
          <span style={s.dot('#22dd55')} />
          <span>Goal met (≥ {formatCurrency(DAILY_GOAL)})</span>
          <span style={{ marginLeft: 4 }} />
          <span style={s.dot('#d4f4dd')} />
          <span>Earnings logged</span>
          <span style={{ marginLeft: 4 }} />
          <span style={s.dot('#b6d8f4')} />
          <span>Today</span>
          <span style={{ marginLeft: 4 }} />
          <span style={s.dot('#7780ff')} />
          <span>Selected</span>
        </div>

        {/* Info Bar */}
        <div style={s.info}>
          <span>
            📅 Selected:{' '}
            <strong>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </strong>
          </span>
          {selNet > 0 ? (
            <span>
              💰 Earnings: <strong>{formatCurrency(selNet)}</strong>{' '}
              {selGoalMet
                ? '✅ Goal met!'
                : `⚠️ ${formatCurrency(DAILY_GOAL - selNet)} short`}
            </span>
          ) : (
            <span>💰 No earnings recorded</span>
          )}
        </div>
      </div>
    </div>
  );
}
