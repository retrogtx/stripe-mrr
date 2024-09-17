'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, MinusIcon } from 'lucide-react'

const Graph = ({ data, projectedData, startDate, endDate }: {
  data: number[];
  projectedData: number[];
  startDate: Date;
  endDate: Date;
}) => {
  const maxValue = Math.max(...data,  ...projectedData)
  const minValue = Math.min(...data, ...projectedData)
  const range = maxValue - minValue

  const normalizeValue = (value: number) => {
    return 90 - ((value - minValue) / range) * 80
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('default', { month: 'short', year: 'numeric' })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
  }

  const yAxisLabels = [maxValue, (minValue + maxValue) / 2, minValue]

  return (
    <div className="w-full h-64 bg-white relative">
      <div className="absolute top-0 left-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500 py-2">
        {yAxisLabels.map((value, index) => (
          <div key={index}>{formatCurrency(value)}</div>
        ))}
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Horizontal grid lines */}
        {[10, 50, 90].map((y) => (
          <line key={y} x1="16" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
        ))}
        
        {/* Projected line */}
        <polyline
          points={projectedData.map((value, index) => `${16 + index * (84 / (projectedData.length - 1))},${normalizeValue(value)}`).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Actual line */}
        <polyline
          points={data.map((value, index) => `${16 + index * (84 / (data.length - 1))},${normalizeValue(value)}`).join(' ')}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute bottom-0 left-16 right-0 flex justify-between text-xs text-gray-500 px-2">
        <span>{formatDate(startDate)}</span>
        <span>{formatDate(endDate)}</span>
      </div>
    </div>
  )
}

export function EnhancedMrrGenerator() {
  const [tiers, setTiers] = useState([{ name: 'Basic', price: 9.99, customers: 100 }])
  const [projectionMonths, setProjectionMonths] = useState(12)
  const [startDate, setStartDate] = useState(new Date('2023-01-01'))
  const [growthRate, setGrowthRate] = useState(10) // 10% monthly growth rate by daefault

  const addTier = () => {
    setTiers([...tiers, { name: '', price: 0, customers: 0 }])
  }

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index))
  }

  const updateTier = (index: number, field: keyof typeof tiers[0], value: string) => {
    const newTiers = [...tiers];
    if (field === 'name') {
      newTiers[index][field] = value;
    } else if (field === 'price' || field === 'customers') {
      newTiers[index][field] = parseFloat(value);
    }
    setTiers(newTiers);
  }

  const calculateMRR = () => {
    return tiers.reduce((total, tier) => total + tier.price * tier.customers, 0)
  }

  const generateProjection = () => {
    const initialMRR = calculateMRR()
    return Array(projectionMonths).fill(0).map((_, i) => 
      initialMRR * Math.pow(1 + growthRate / 100, i)
    )
  }

  const [mrrData, setMrrData] = useState<number[]>([])
  const [projectedData, setProjectedData] = useState<number[]>([])

  useEffect(() => {
    const projection = generateProjection()
    setMrrData(projection.map(value => value * (1 + (Math.random() - 0.5) * 0.1))) 
    setProjectedData(projection)
  }, [tiers, projectionMonths, growthRate])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)
  }

  const calculateGrowth = () => {
    const start = mrrData[0]
    const end = mrrData[mrrData.length - 1]
    return ((end - start) / start * 100).toFixed(1)
  }

  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + projectionMonths - 1)

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-purple-600">Stripe MRR Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tiers.map((tier, index) => (
                <div key={index} className="flex items-end space-x-4">
                  <div className="flex-1">
                    <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
                    <Input
                      id={`tier-name-${index}`}
                      value={tier.name}
                      onChange={(e) => updateTier(index, 'name', e.target.value)}
                      placeholder="e.g. Basic"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`tier-price-${index}`}>Price (€)</Label>
                    <Input
                      id={`tier-price-${index}`}
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(index, 'price', e.target.value)}
                      placeholder="9.99"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`tier-customers-${index}`}>Customers</Label>
                    <Input
                      id={`tier-customers-${index}`}
                      type="number"
                      value={tier.customers}
                      onChange={(e) => updateTier(index, 'customers', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => removeTier(index)}>
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addTier} className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" /> Add Tier
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-purple-600">MRR Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <div>
                <Label htmlFor="projection-months">Projection Months</Label>
                <Input
                  id="projection-months"
                  type="number"
                  value={projectionMonths}
                  onChange={(e) => setProjectionMonths(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="month"
                  value={startDate.toISOString().slice(0, 7)}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="growth-rate">Monthly Growth Rate (%)</Label>
                <Input
                  id="growth-rate"
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold mr-2">MRR</span>
                  <span className="text-sm font-medium text-green-600">+{calculateGrowth()}%</span>
                </div>
                <span className="text-gray-500">{formatCurrency(mrrData[0])}</span>
              </div>
              <div className="text-3xl font-bold">{formatCurrency(mrrData[mrrData.length - 1])}</div>
              <Graph data={mrrData} projectedData={projectedData} startDate={startDate} endDate={endDate} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}