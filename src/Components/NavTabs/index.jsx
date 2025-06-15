import { Tab, Box } from "@mui/material";
import { TabList } from "@mui/lab";
import TabLabel from "../TabLabel";

function NavTabs({ tabs, currentValue, onChange }) {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto",
        px: { xs: 1, sm: 2 },
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <TabList
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        centered={false}
        sx={{
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "3px 3px 0 0",
            background: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
          },
          "& .MuiTab-root": {
            minHeight: 64,
            fontWeight: 600,
            textTransform: "none",
            fontSize: { xs: "0.85rem", sm: "0.95rem" },
            color: "rgba(0, 0, 0, 0.6)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: "#6366F1",
              backgroundColor: "rgba(99, 102, 241, 0.04)",
            },
            "&.Mui-selected": {
              color: "#6366F1",
              fontWeight: 700,
            },
            "& .MuiTab-iconWrapper": {
              marginBottom: "4px",
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={
              <TabLabel
                icon={tab.icon}
                label={tab.label}
                selected={currentValue === tab.value}
              />
            }
            value={tab.value}
            sx={{
              position: "relative",
              overflow: "hidden",
              "&::after":
                currentValue === tab.value
                  ? {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40%",
                      height: "3px",
                      borderRadius: "3px 3px 0 0",
                      backgroundColor: "transparent",
                      boxShadow: "0 0 8px 2px rgba(99, 102, 241, 0.3)",
                    }
                  : {},
            }}
          />
        ))}
      </TabList>
    </Box>
  );
}

export default NavTabs;
