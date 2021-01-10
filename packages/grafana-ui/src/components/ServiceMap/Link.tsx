import React, { MouseEvent } from 'react';
import { LinkDatum, NodeDatum } from './types';

interface Props {
  link: LinkDatum;
  hovering: boolean;
  onClick: (event: MouseEvent<SVGElement>, link: LinkDatum) => void;
  onMouseEnter: (id: string) => void;
  onMouseLeave: (id: string) => void;
}
export function Link(props: Props) {
  const { link, onClick, onMouseEnter, onMouseLeave, hovering } = props;
  const { source, target } = link as { source: NodeDatum; target: NodeDatum };

  // As the nodes have some radius we want edges to end outside of the node circle.
  const line = shortenLine(
    {
      x1: source.x!,
      y1: source.y!,
      x2: target.x!,
      y2: target.y!,
    },
    90
  );

  return (
    <g onClick={event => onClick(event, link)} style={{ cursor: 'pointer' }}>
      <line
        strokeWidth={hovering ? 2 : 1}
        stroke={'#999'}
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        markerEnd="url(#triangle)"
      />
      <line
        stroke={'transparent'}
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        strokeWidth={20}
        onMouseEnter={() => {
          onMouseEnter(link.id);
        }}
        onMouseLeave={() => {
          onMouseLeave(link.id);
        }}
      />
    </g>
  );
}

type Line = { x1: number; y1: number; x2: number; y2: number };

/**
 * Makes line shorter while keeping the middle in he same place.
 */
function shortenLine(line: Line, length: number): Line {
  const vx = line.x2 - line.x1;
  const vy = line.y2 - line.y1;
  const mag = Math.sqrt(vx * vx + vy * vy);
  const ratio = Math.max((mag - length) / mag, 0);
  const vx2 = vx * ratio;
  const vy2 = vy * ratio;
  const xDiff = vx - vx2;
  const yDiff = vy - vy2;
  const newx1 = line.x1 + xDiff / 2;
  const newy1 = line.y1 + yDiff / 2;
  return {
    x1: newx1,
    y1: newy1,
    x2: newx1 + vx2,
    y2: newy1 + vy2,
  };
}
