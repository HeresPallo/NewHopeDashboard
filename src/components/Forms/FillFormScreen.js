import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, 
  StyleSheet, Alert, Platform 
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// This screen expects that the shared form object is passed via route.params.form.
// For a Confirmation Journal shared form, we expect route.params.form.form_name to be "Confirmation Journal".
const FillFormScreen = ({ route, navigation }) => {
  const { form } = route.params; // contains information about which form is shared
  // Form header fields
  const [district, setDistrict] = useState("");
  const [centreName, setCentreName] = useState("");
  const [centreCode, setCentreCode] = useState("");
  // For dynamic entries: each entry is an object with name, confirmationNumber, telephone, and date.
  const [entries, setEntries] = useState([
    { name: "", confirmationNumber: "", telephone: "", date: "" }
  ]);

  // For date picker handling
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(null);

  // Update entry value for given row and field
  const handleInputChange = (index, field, value) => {
    const updatedEntries = entries.map((entry, idx) =>
      idx === index ? { ...entry, [field]: value } : entry
    );
    setEntries(updatedEntries);
  };

  // Add a new empty entry row
  const addRow = () => {
    setEntries([...entries, { name: "", confirmationNumber: "", telephone: "", date: "" }]);
  };

  // Handle date selection for a specific row
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && currentEntryIndex !== null) {
      const dateString = selectedDate.toISOString().split("T")[0];
      handleInputChange(currentEntryIndex, "date", dateString);
    }
  };

  // When the form is submitted, you can send the collected data to your API.
  const handleSubmit = () => {
    const formData = {
      district,
      centreName,
      centreCode,
      entries
    };
    console.log("Submitting form data:", formData);
    // TODO: Send formData to your backend API (for example using axios).
    Alert.alert("Success", "Form submitted successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {form && form.form_name ? form.form_name : "Shared Form"}
      </Text>
      
      {/* Header Fields */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>District</Text>
        <TextInput 
          style={styles.input}
          placeholder="Enter district"
          value={district}
          onChangeText={setDistrict}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Centre Name</Text>
        <TextInput 
          style={styles.input}
          placeholder="Enter centre name"
          value={centreName}
          onChangeText={setCentreName}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Centre Code</Text>
        <TextInput 
          style={styles.input}
          placeholder="Enter centre code"
          value={centreCode}
          onChangeText={setCentreCode}
        />
      </View>
      
      <Text style={styles.subtitle}>Entries</Text>
      {entries.map((entry, index) => (
        <View key={index} style={styles.entryContainer}>
          <Text style={styles.entryTitle}>Entry {index + 1}</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter name"
              value={entry.name}
              onChangeText={(text) => handleInputChange(index, "name", text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmation Number</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter confirmation number"
              value={entry.confirmationNumber}
              onChangeText={(text) => handleInputChange(index, "confirmationNumber", text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telephone</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter telephone"
              value={entry.telephone}
              onChangeText={(text) => handleInputChange(index, "telephone", text)}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Confirmation</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => {
                setCurrentEntryIndex(index);
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.dateButtonText}>
                {entry.date ? entry.date : "Select Date"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {showDatePicker && (
        <DateTimePicker 
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <Text style={styles.addButtonText}>Add Row</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15
  },
  entryContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center"
  },
  dateButtonText: {
    fontSize: 16
  },
  addButton: {
    backgroundColor: "#36A2EB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16
  },
  submitButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    alignItems: "center"
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16
  }
});

export default FillFormScreen;
