// Measurements are stored in cm as [min, max]; inches are calculated in the UI.
// Sample values: verify them against your own size chart.
export const sizeGuide = {
  men: {
    label: "Men",
    sizeLabel: "Size",
    columns: ["Chest", "Waist", "Hips"],
    rows: [
      { size: "XS", values: [[84, 88], [70, 74], [88, 92]] },
      { size: "S", values: [[92, 96], [78, 82], [94, 98]] },
      { size: "M", values: [[100, 104], [86, 90], [100, 104]] },
      { size: "L", values: [[108, 112], [94, 98], [106, 110]] },
      { size: "XL", values: [[116, 120], [102, 106], [112, 116]] },
      { size: "XXL", values: [[124, 128], [110, 114], [118, 122]] },
    ],
  },
  women: {
    label: "Women",
    sizeLabel: "Size",
    columns: ["Bust", "Waist", "Hips"],
    rows: [
      { size: "XS", values: [[80, 83], [60, 63], [86, 89]] },
      { size: "S", values: [[84, 87], [64, 67], [90, 93]] },
      { size: "M", values: [[88, 91], [68, 71], [94, 97]] },
      { size: "L", values: [[92, 97], [72, 77], [98, 103]] },
      { size: "XL", values: [[98, 103], [78, 83], [104, 109]] },
      { size: "XXL", values: [[104, 109], [84, 89], [110, 115]] },
    ],
  },
  kids: {
    label: "Kids",
    sizeLabel: "Age",
    columns: ["Height", "Chest", "Waist"],
    rows: [
      { size: "2–3 yrs", values: [[92, 98], [53, 55], [51, 53]] },
      { size: "4–5 yrs", values: [[104, 110], [57, 59], [53, 55]] },
      { size: "6–7 yrs", values: [[116, 122], [61, 64], [55, 57]] },
      { size: "8–9 yrs", values: [[128, 134], [67, 70], [58, 60]] },
      { size: "10–11 yrs", values: [[140, 146], [73, 76], [61, 63]] },
      { size: "12–13 yrs", values: [[152, 158], [79, 83], [64, 67]] },
    ],
  },
};

export const sizeGuideNote =
  "Measurements are body measurements and are approximate. If you're between sizes, we recommend sizing up.";

export const measureTips = [
  { title: "Chest / bust", text: "Measure around the fullest part, keeping the tape level under your arms." },
  { title: "Waist", text: "Measure around your natural waistline, the narrowest part of your torso." },
  { title: "Hips", text: "Measure around the fullest part of your hips, about 20 cm below your waist." },
];