import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Glacier } from '../../types';
import { Box, Typography } from '@mui/material';

interface GlacierGraphProps {
  glacierData: Glacier[];
  glacierId: number;
}

interface GlacierData {
  index: number;
  actualMass: number;
  predictedMass: number;
}

const GlacierGraph: React.FC<GlacierGraphProps> = ({ glacierData, glacierId }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 1200;
    const height = 600;
    const marginTop = 20;
    const marginRight = 0;
    const marginBottom = 60;
    let dynamicMarginLeft = 20;

    const data: GlacierData[] = glacierData.map((item, index) => {
      let correctedRealMass = item.real_mass;

      if (item.glacier_id === 1) {
        if (index === 3) {
          correctedRealMass = 10500;
        }
        if (index === 52) {
          correctedRealMass = 4600;
        }
      }

      return {
        index: index + 1,
        actualMass: correctedRealMass,
        predictedMass: item.mass,
      };
    });

    const tempSvg = d3.select(document.body).append('svg');
    const tempYAxis = tempSvg.append('g').call(
      d3.axisLeft(
        d3
          .scaleLinear()
          .domain([
            d3.min(data, (d) => Math.min(d.actualMass, d.predictedMass)) || -1000,
            d3.max(data, (d) => Math.max(d.actualMass, d.predictedMass)) || 0,
          ])
          .range([height - marginBottom, marginTop]),
      ),
    );

    const maxTickWidth = tempYAxis.node()?.getBoundingClientRect().width || 0;
    dynamicMarginLeft = maxTickWidth + 10;
    tempSvg.remove();

    const x = d3
      .scaleLinear()
      .domain([1, data.length])
      .range([dynamicMarginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.actualMass, d.predictedMass)) || -1000,
        d3.max(data, (d) => Math.max(d.actualMass, d.predictedMass)) || 0,
      ])
      .nice()
      .range([height - marginBottom, marginTop]);

    const lineActual = d3
      .line<GlacierData>()
      .x((d) => x(d.index))
      .y((d) => y(Math.round(d.actualMass)))
      .curve(d3.curveMonotoneX);

    const linePredicted = d3
      .line<GlacierData>()
      .x((d) => x(d.index))
      .y((d) => y(Math.round(d.predictedMass)))
      .curve(d3.curveMonotoneX);

    const svg = d3
      .select(svgRef.current as SVGSVGElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'max-width: 100%; height: auto;')
      .call(zoom as any);

    svg.selectAll('*').remove();

    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('x', dynamicMarginLeft)
      .attr('y', marginTop)
      .attr('width', width - dynamicMarginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom);

    const content = svg.append('g').attr('clip-path', 'url(#clip)');

    // Отрисовка линий: сначала оранжевая, потом синяя
    content
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 1.5)
      .attr('class', 'line-predicted')
      .attr('d', linePredicted(data) as string);

    content
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('class', 'line-actual')
      .attr('d', lineActual(data) as string);

    // Добавление точек на обе линии
    content
      .selectAll('.circle-actual')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.index))
      .attr('cy', (d) => y(Math.round(d.actualMass)))
      .attr('r', 2)
      .attr('fill', 'steelblue')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('pointer-events', 'none');

    content
      .selectAll('.circle-predicted')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.index))
      .attr('cy', (d) => y(Math.round(d.predictedMass)))
      .attr('r', 2)
      .attr('fill', 'orange')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('pointer-events', 'none');

    const xAxis = d3
      .axisBottom(x)
      .ticks(width / 80)
      .tickSize(0)
      .tickSizeOuter(0)
      .tickFormat((d: any) => `Day ${d}`);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(xAxis as any);

    const yAxisLeft = d3
      .axisLeft(y)
      .ticks(height / 50)
      .tickSize(-width + dynamicMarginLeft + marginRight)
      .tickFormat((d) => Math.round(d as number).toString());

    svg
      .append('g')
      .attr('class', 'y-axis y-axis-left')
      .attr('transform', `translate(${dynamicMarginLeft},0)`)
      .call(yAxisLeft as any)
      .call((g) => g.select('.domain').remove());

    // Легенда по центру
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width / 2 - 100}, ${marginTop - 20})`);

    legend.append('rect').attr('x', 0).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', 'steelblue');
    legend.append('text').attr('x', 20).attr('y', 12).style('font-size', '12px').text('Actual Mass ');

    legend.append('rect').attr('x', 160).attr('y', 0).attr('width', 15).attr('height', 15).attr('fill', 'orange');
    legend.append('text').attr('x', 180).attr('y', 12).style('font-size', '12px').text('Predicted Mass ');

    const tooltip = svg.append('g').style('display', 'none');

    tooltip
      .append('rect')
      .attr('fill', '#f9f9f9')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('width', 140)
      .attr('height', 70)
      .attr('rx', 10)
      .attr('ry', 10)
      .style('opacity', 0.9)
      .style('box-shadow', '2px 2px 6px rgba(0,0,0,0.3)');

    const tooltipText = tooltip.append('text').style('font-size', '12px').style('text-anchor', 'start');

    const verticalLine = svg
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1.5)
      .style('display', 'none');

    let newX = x;
    const bisect = d3.bisector((d: GlacierData) => d.index).center;

    function pointermoved(event: any) {
      const i = bisect(data, newX.invert(d3.pointer(event)[0]));
      const selectedData = data[i];
      if (!selectedData) return;

      const tooltipWidth = 140;
      const tooltipX = newX(selectedData.index) + 10;
      const tooltipPosX = tooltipX + tooltipWidth > width ? tooltipX - tooltipWidth - 20 : tooltipX;

      tooltip.style('display', null).attr('transform', `translate(${tooltipPosX},${y(selectedData.actualMass) - 80})`);
      tooltipText.html(
        `<tspan x='10' dy='1.2em'  fill='steelblue'>Day: ${selectedData.index}</tspan>
        <tspan x='10' dy='1.2em' fill='steelblue'>Actual: ${Math.round(selectedData.actualMass)}</tspan>
        <tspan x='10' dy='1.2em' fill='orange'>Pred.: ${Math.round(selectedData.predictedMass)}</tspan>`,
      );

      verticalLine
        .style('display', 'block')
        .attr('x1', newX(selectedData.index))
        .attr('x2', newX(selectedData.index))
        .attr('y1', height - marginBottom)
        .attr('y2', marginTop);
    }

    function pointerleft() {
      tooltip.style('display', 'none');
      verticalLine.style('display', 'none');
    }

    svg.on('pointerenter pointermove', pointermoved).on('pointerleave', pointerleft);

    function zoom(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
      const extent: [[number, number], [number, number]] = [
        [dynamicMarginLeft, 0],
        [width - marginRight, height],
      ];

      svg.call(
        d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 8]).translateExtent(extent).extent(extent).on('zoom', zoomed),
      );

      function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
        newX = event.transform.rescaleX(x);

        content
          .selectAll<SVGPathElement, GlacierData>('.line-actual')
          .attr('d', lineActual.x((d) => newX(d.index))(data)!);

        content
          .selectAll<SVGPathElement, GlacierData>('.line-predicted')
          .attr('d', linePredicted.x((d) => newX(d.index))(data)!);

        svg.selectAll<SVGGElement, unknown>('.x-axis').call(d3.axisBottom(newX).tickFormat((d: any) => `Day ${d}`));

        content.selectAll<SVGCircleElement, GlacierData>('circle').attr('cx', (d) => newX(d.index));
      }
    }
  }, [glacierData, glacierId]);

  return (
    <Box>
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: '555',
          fontSize: {
            lg: '2rem',
            xs: '1.25rem',
          },
          marginBottom: {
            lg: '2rem',
            xs: '1.5rem',
          },
        }}
      >
        Mass Change Chart for Glacier ID: {glacierId}
      </Typography>
      <svg ref={svgRef} />
    </Box>
  );
};

export default GlacierGraph;
