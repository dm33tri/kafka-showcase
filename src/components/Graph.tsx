import { FC, useMemo } from "react"
import { useGetMessageQuery } from "../services/messages"
import ReactApexChart from "react-apexcharts"
import { ApexOptions } from "apexcharts"

const BUCKETS = 10

export const Graph: FC = () => {
  const { data } = useGetMessageQuery()

  const series = useMemo(() => {
    if (!data) {
        return
    }
    const now = Date.now()
    return [{
      name: 'Data transfered (bytes)',
      data: data.filter(Boolean).reduce((acc, message) => {
        const time = Math.floor(message.timestamp / 1000)
        if (acc.length == 0 || time !== acc[acc.length - 1].x) {
          acc.push({ x: time, y: message.to.length * message.data.length })
        } else {
          acc[acc.length - 1].y += message.to.length * message.data.length
        }
        return acc;
      }, [] as { x: number, y: number }[])
    }]
  }, [data])

  const options = useMemo<ApexOptions>(() => ({
    chart: {
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      stacked: true
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      tickAmount: 10,
      type: 'datetime',
      axisTicks: {
        show: false
      },
      range: 60
    },
    tooltip: {
      x: {
        format: 'HH:mm:ff'
      }
    },
    stroke: {
      curve: 'smooth'
    }
  }), [])
  
  return series ? (
    <ReactApexChart options={options} series={series} type="area" height={350} />
  ) : null
}
