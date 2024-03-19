import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../../utlits/colors";
import AllEvents from "../Events/AllEvents";
import Report from "../Events/Report";
import { useAuth } from "../../context/Auth";

const Events = () => {
  const { eventData,user } = useAuth();
  const [activeTab, setActiveTab] = useState("Report");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [pendingEvents, setPendingEvents] = useState<any>();
  const [dispatchEvents, setDispatchEvents] = useState<any>();

  useEffect(() => {
    if (eventData && eventData?.length > 0) {
      const pendingList = eventData
        ?.filter((event: any) => event?.statusCode === 7)
        ?.slice(0, 100);
      const dispatchList = eventData
        ?.filter((event: any) => event?.statusCode === 18)
        ?.slice(0, 100);
      setPendingEvents([...pendingList]);
      setDispatchEvents([...dispatchList]);
    }
  }, [eventData]);

  const handleSorting = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSortDirection);
  };
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  const renderTabContent = (activeTab: string) => {
    if (activeTab === "Report") {
      return <Report dispatchEvents={dispatchEvents} />;
    } else if (activeTab === "Events") {
      return (
        <AllEvents
          data={pendingEvents}
          searchQuery={searchQuery}
          handleSorting={handleSorting}
          sortDirection={sortDirection}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.events}>
        <Text style={styles.allEvents}>All Events</Text>
        <View style={styles.errorIcon}>
          <MaterialIcons name="error-outline" color="#00526F" size={20} />
        </View>
      </View>
      <View style={styles.tabContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={{ width: "50%" }}
            onPress={() => handleTabPress("Report")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  backgroundColor:
                    activeTab === "Report"
                      ? colors.tabBackgroundColor
                      : "#F9FAFB",
                  color: activeTab === "Report" ? "#FFF" : "#000",
                  borderTopLeftRadius: activeTab === "Report" ? 4 : 0,
                  borderBottomLeftRadius: activeTab === "Report" ? 4 : 0,
                  borderTopRightRadius: activeTab === "Report" ? 4 : 0,
                  borderBottomRightRadius: activeTab === "Report" ? 4 : 0,
                },
              ]}
            >
              Dispatch Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: "50%" }}
            onPress={() => handleTabPress("Events")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  backgroundColor:
                    activeTab === "Events"
                      ? colors.tabBackgroundColor
                      : "#F9FAFB",
                  color: activeTab === "Events" ? "#FFF" : "#000",
                  borderTopLeftRadius: activeTab === "Events" ? 4 : 0,
                  borderBottomLeftRadius: activeTab === "Events" ? 4 : 0,
                  borderTopRightRadius: activeTab === "Events" ? 4 : 0,
                  borderBottomRightRadius: activeTab === "Events" ? 4 : 0,
                },
              ]}
            >
              Pending Events ({pendingEvents?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Events" && (
          <View style={styles.searchContainer}>
            <View style={styles.searchRow}>
              <MaterialIcons
                name="search"
                size={28}
                color={colors.iconGrayColor}
                style={{ marginLeft: 7 }}
              />
              <TextInput
                style={{
                  height: 41,
                  backgroundColor: colors.appBackgroundColor,
                  width: "75%",
                }}
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={styles.iconContainer}>
                {/* <Image 
                source={require("../../assets/filter_alt.png")}
                /> */}
                <MaterialIcons
                  name="filter-alt"
                  color={colors.tabBackgroundColor}
                  size={22}
                />
              </View>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={handleSorting}
              >
                <MaterialIcons
                  name="sort-by-alpha"
                  color={colors.tabBackgroundColor}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View>{renderTabContent(activeTab)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.appBackgroundColor,
    flex: 1,
  },
  events: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 5,
  },
  allEvents: {
    color: colors.textBlueColor,
    fontSize: 18,
    fontWeight: "bold",
  },
  tabContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayBorderColor,
  },
  tabsContainer: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 6,
    backgroundColor: colors.grayBackgroundColor,
  },
  tabText: {
    paddingVertical: 7,
    fontSize: 14,
    textAlign: "center",
  },
  errorIcon: {
    height: 36,
    width: 36,
    borderRadius: 4,
    backgroundColor: colors.grayBackgroundColor,
    borderColor: colors.borderColor,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.grayBorderColor,
    width: "75%",
  },
  iconContainer: {
    height: 35,
    width: 35,
    backgroundColor: colors.grayBackgroundColor,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.tabBackgroundColor,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Events;
