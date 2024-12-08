import { Card, CardContent, CardHeader, List, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Results({ results }) {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title={<Typography variant="h6">Results</Typography>} />
      <CardContent>
        <List sx={{ listStyleType: "disc", pl: 2 }}>
          {results.map((result, index) => (
            <ListItem key={index} sx={{ display: "list-item" }}>
              {result}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
