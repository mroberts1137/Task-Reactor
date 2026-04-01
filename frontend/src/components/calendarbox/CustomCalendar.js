import { useState, useMemo, useContext } from 'react';
import styled from 'styled-components';
import Calendar from './Calendar';
import {
  DateContext,
  TaskContext,
  DailyGoalsContext
} from '../../contexts/context';

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

const formatCurrency = (v) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(v);

export default function EarningsCalendar() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const { tasks } = useContext(TaskContext);
  const { dailyTotalGoals } = useContext(DailyGoalsContext);

  const taskMap = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
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
    const goalMet = net >= dailyTotalGoals;
    const color = isSelected ? '#fff' : goalMet ? '#155724' : '#28a745';
    return <span style={{ color }}>{formatCurrency(net)}</span>;
  };

  const getCellBackground = (date) => {
    const net = getNet(date);
    if (net >= dailyTotalGoals) return '#22dd55';
    if (net > 0) return '#22dd5528';
    return undefined;
  };

  const legend = (
    <Legend>
      <LegendDot $bg='#22dd55' />
      Goal met (≥ {formatCurrency(dailyTotalGoals)})
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
