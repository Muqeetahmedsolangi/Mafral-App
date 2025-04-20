import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { EventCategory } from "@/types/types";

interface CategoryButtonProps {
  category: EventCategory;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  category, 
  isSelected, 
  onPress,
  colors,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected 
            ? category.color 
            : colors.surfaceVariant,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={category.icon as any} 
        size={18} 
        color={isSelected ? "#FFFFFF" : category.color} 
        style={styles.icon} 
      />
      <Text 
        style={[
          styles.text, 
          { color: isSelected ? "#FFFFFF" : colors.text }
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CategoryButton;