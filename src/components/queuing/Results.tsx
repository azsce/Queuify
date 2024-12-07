
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Results({ results }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5">
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}