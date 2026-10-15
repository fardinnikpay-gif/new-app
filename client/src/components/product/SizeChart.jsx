import { useState } from "react";
import { sizeGuide, sizeGuideNote } from "../../data/sizeGuide";
import SegmentedControl from "../common/SegmentedControl";

const CM_PER_INCH = 2.54;
const UNITS = [
  { value: "cm", label: "cm" },
  { value: "in", label: "inches" },
];
const GROUPS = Object.entries(sizeGuide).map(([value, { label }]) => ({ value, label }));

const convert = (cm, unit) => (unit === "cm" ? cm : Math.round((cm / CM_PER_INCH) * 10) / 10);
const formatRange = ([min, max], unit) => `${convert(min, unit)}–${convert(max, unit)}`;

// Size tables with a group switch (men/women/kids) and a cm/inch switch.
export default function SizeChart() {
  const [group, setGroup] = useState("men");
  const [unit, setUnit] = useState("cm");
  const chart = sizeGuide[group];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl label="Size chart for" options={GROUPS} value={group} onChange={setGroup} />
        <SegmentedControl label="Units" options={UNITS} value={unit} onChange={setUnit} />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left text-sm">
          <caption className="sr-only">
            {chart.label} size chart in {unit === "cm" ? "centimetres" : "inches"}
          </caption>
          <thead>
            <tr className="border-b border-neutral-200">
              <th scope="col" className="py-3 pr-4 font-medium text-ink">
                {chart.sizeLabel}
              </th>
              {chart.columns.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 font-medium text-ink">
                  {column} ({unit})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.size} className="border-b border-neutral-100">
                <th scope="row" className="py-3 pr-4 font-medium text-ink">
                  {row.size}
                </th>
                {row.values.map((range, index) => (
                  <td key={index} className="px-4 py-3 text-neutral-600">
                    {formatRange(range, unit)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-neutral-600">{sizeGuideNote}</p>
    </div>
  );
}