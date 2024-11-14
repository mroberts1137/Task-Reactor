import styled from 'styled-components';
import { Resizable } from 'react-resizable';

export const ResizableHeader = styled(Resizable)`
  .react-resizable-handle {
    position: absolute;
    width: 10px;
    height: 100%;
    bottom: 0;
    right: -5px;
    cursor: col-resize;
    z-index: 1;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  overflow-x: auto;

  th {
    background-color: ${(props) => props.theme.colors.table.headerBackground};
    color: ${(props) => props.theme.colors.text.primary};
    padding: 12px;
    text-align: left;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  th,
  td {
    padding: 0.5rem 0.5rem;
    border: 1px solid rgb(84, 84, 84);
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr:nth-child(even) {
    background-color: ${(props) => props.theme.colors.table.evenRow};
  }

  tr:nth-child(odd) {
    background-color: ${(props) => props.theme.colors.table.oddRow};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colors.table.hover};
  }
`;
