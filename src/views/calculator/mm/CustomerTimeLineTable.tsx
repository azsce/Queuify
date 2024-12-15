import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery,
  alpha,
  Divider,
  useTheme,
} from "@mui/material";
import MM1QueueSimulator from "@/class/mm/MM";
import { roundTo4Decimals } from "@/lib/math";

interface CustomerTimeLineTableProps {
  simulator: MM1QueueSimulator;
}

const CustomerTimeLineTable: React.FC<CustomerTimeLineTableProps> = ({
  simulator,
}) => {
  const theme = useTheme();
  const data = simulator.customerLineData;
  const statistics = simulator.statistics;
  const numberOfSumulations = simulator.numOfSimulations;
  const isDarkMode = theme.palette.mode === "dark";

  const filteredData = data.filter(
    (row) => row.customer > 0 && row.customer <= numberOfSumulations
  );

  const isMobile = useMediaQuery("(max-width: 600px)");

  // Common cell styling for column dividers
  const columnDividerStyle = {
    borderRight: `1px solid ${
      isDarkMode
        ? alpha(theme.palette.divider, 0.3)
        : alpha(theme.palette.primary.light, 0.3)
    }`,
    "&:last-child": {
      borderRight: "none",
    },
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: isDarkMode
          ? alpha(theme.palette.background.default, 0.9)
          : undefined,
      }}
    >
      <Table aria-label="customer timeline table">
        <TableHead
          sx={{
            backgroundColor: isDarkMode
              ? alpha(theme.palette.primary.dark, 0.7)
              : theme.palette.primary.main,
            "& .MuiTableCell-root": {
              color: isDarkMode
                ? theme.palette.primary.contrastText
                : theme.palette.primary.contrastText,
              fontWeight: "bold",
              ...columnDividerStyle,
            },
          }}
        >
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Arrival</TableCell>
            <TableCell>{isMobile ? "Service" : "Service Start"}</TableCell>
            <TableCell>{isMobile ? "WQ" : "Waiting In Queue"}</TableCell>
            <TableCell>{isMobile ? "D" : "Departure"}</TableCell>
            <TableCell>{isMobile ? "W" : "Waiting In System"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                padding: 0,
                borderBottom: `1px solid ${
                  isDarkMode
                    ? alpha(theme.palette.divider, 0.5)
                    : alpha(theme.palette.primary.light, 0.5)
                }`,
              }}
            >
              <Divider
                sx={{
                  backgroundColor: isDarkMode
                    ? alpha(theme.palette.divider, 0.5)
                    : alpha(theme.palette.primary.light, 0.5),
                  height: "2px",
                }}
              />
            </TableCell>
          </TableRow>
          {filteredData.map((row, index) => (
            <TableRow
              key={row.customer}
              sx={{
                backgroundColor: isDarkMode
                  ? index % 2
                    ? alpha(theme.palette.primary.dark, 0.2)
                    : alpha(theme.palette.background.default, 0.1)
                  : index % 2
                    ? alpha(theme.palette.primary.light, 0.1)
                    : "white",
              }}
            >
              {[
                row.customer,
                roundTo4Decimals(row.arrivalTime) ?? "N/A",
                roundTo4Decimals(row.serviceStartTime) ?? "N/A",
                roundTo4Decimals(row.waitingInQueueTime) ?? "N/A",
                roundTo4Decimals(row.departureTime) ?? "N/A",
                roundTo4Decimals(row.waitingInSystemTime) ?? "N/A",
              ].map((cellContent, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  sx={{
                    ...columnDividerStyle,
                    color: isDarkMode ? theme.palette.text.primary : undefined,
                  }}
                >
                  {cellContent}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                padding: 0,
                borderBottom: `1px solid ${
                  isDarkMode
                    ? alpha(theme.palette.divider, 0.5)
                    : alpha(theme.palette.primary.light, 0.5)
                }`,
              }}
            >
              <Divider
                sx={{
                  backgroundColor: isDarkMode
                    ? alpha(theme.palette.secondary.dark, 0.5)
                    : alpha(theme.palette.secondary.light, 0.5),
                  height: "2px",
                }}
              />
            </TableCell>
          </TableRow>
          {/* total */}
          <TableRow>
            <TableCell sx={columnDividerStyle}>
              <Typography variant="subtitle2">Totals:</Typography>
            </TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}>
              {roundTo4Decimals(statistics.totalWaitingTime)}
            </TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}>
              {roundTo4Decimals(statistics.totalWaitingTimeInQueue)}
            </TableCell>
          </TableRow>
          {/* avarage */}
          <TableRow
            sx={{
              fontStyle: "italic",
            }}
          >
            <TableCell sx={columnDividerStyle}>
              <Typography variant="subtitle2">Averages:</Typography>
            </TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}>
              {roundTo4Decimals(statistics.averageWaitingTime)}
            </TableCell>
            <TableCell sx={columnDividerStyle}></TableCell>
            <TableCell sx={columnDividerStyle}>
              {roundTo4Decimals(statistics.averageWaitingTimeInQueue)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerTimeLineTable;
