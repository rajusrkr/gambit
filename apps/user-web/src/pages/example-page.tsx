import Chart from "@/components/chart";

export default function ExamplePage() {
  const initialData1 = [
    { time: "2018-12-22", value: 5.51 },
    { time: "2018-12-23", value: 20.11 },
    { time: "2018-12-24", value: 10.02 },
    { time: "2018-12-25", value: 21.32 },
    { time: "2018-12-26", value: 18.17 },
    { time: "2018-12-27", value: 25.89 },
    { time: "2018-12-28", value: 4.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 35.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

  const initialData2 = [
    { time: "2018-12-22", value: 15.51 },
    { time: "2018-12-23", value: 2.11 },
    { time: "2018-12-24", value: 14.02 },
    { time: "2018-12-25", value: 1.32 },
    { time: "2018-12-26", value: 7.17 },
    { time: "2018-12-27", value: 5.89 },
    { time: "2018-12-28", value: 2.46 },
    { time: "2018-12-29", value: 13.92 },
    { time: "2018-12-30", value: 15.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

  const initialData3 = [
    { time: "2018-12-22", value: 3.51 },
    { time: "2018-12-23", value: 2.11 },
    { time: "2018-12-24", value: 15.02 },
    { time: "2018-12-25", value: 13.32 },
    { time: "2018-12-26", value: 17.17 },
    { time: "2018-12-27", value: 15.89 },
    { time: "2018-12-28", value: 21.46 },
    { time: "2018-12-29", value: 1.92 },
    { time: "2018-12-30", value: 15.68 },
    { time: "2018-12-31", value: 12.67 },
  ];
  return (
    <div className="p-4">
      <Chart data1={initialData1} data2={initialData2} data3={initialData3} />
    </div>
  );
}
