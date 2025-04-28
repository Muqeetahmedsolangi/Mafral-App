import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FormSection } from '@/components/ui/FormSection';
import { FormInput } from '@/components/ui/FormInput';
import { FormTextArea } from '@/components/ui/FormTextArea';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { useTheme } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { TableType } from '@/types/restaurant';

type Props = {
  tables: TableType[];
  onTablesChange: (tables: TableType[]) => void;
};

export default function RestaurantTablesSection({ tables, onTablesChange }: Props) {
  const { colors } = useTheme();
  const [editingTable, setEditingTable] = useState<string | null>(null);

  const addTable = () => {
    const newTable: TableType = {
      id: `table_${Date.now()}`,
      name: 'New Table Type',
      capacity: 2,
      quantity: 1,
      description: '',
      image: '',
      count: 0
    };
    
    onTablesChange([...tables, newTable]);
    setEditingTable(newTable.id);
  };

  const updateTableField = (tableId: string, field: keyof TableType, value: any) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        return { ...table, [field]: value };
      }
      return table;
    });
    onTablesChange(updatedTables);
  };

  const deleteTable = (tableId: string) => {
    onTablesChange(tables.filter(table => table.id !== tableId));
    setEditingTable(null);
  };

  const renderTableEditor = (table: TableType) => {
    return (
      <View style={styles.tableEditorContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setEditingTable(null)}
        >
          <Feather name="arrow-left" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Tables</Text>
        </TouchableOpacity>

        <FormInput
          label="Table Name"
          value={table.name}
          onChangeText={(text) => updateTableField(table.id, 'name', text)}
          placeholder="Enter table type name"
        />

        <FormTextArea
          label="Description"
          value={table.description || ''}
          onChangeText={(text) => updateTableField(table.id, 'description', text)}
          placeholder="Describe this type of table"
          minHeight={80}
        />

        <View style={styles.row}>
          <View style={styles.halfColumn}>
            <FormInput
              label="Capacity"
              value={table.capacity.toString()}
              onChangeText={(text) => {
                const capacity = parseInt(text) || 1;
                updateTableField(table.id, 'capacity', capacity);
              }}
              placeholder="Number of seats"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfColumn}>
            <FormInput
              label="Quantity"
              value={table.quantity.toString()}
              onChangeText={(text) => {
                const quantity = parseInt(text) || 1;
                updateTableField(table.id, 'quantity', quantity);
              }}
              placeholder="Number of tables"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Table Image</Text>
        <ImageUploader
          image={table.image ?? null}
          onImageSelected={(url) => updateTableField(table.id, 'image', url)}
          aspectRatio={4/3}
          style={styles.imageUploader}
        />

        <TouchableOpacity 
          style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
          onPress={() => deleteTable(table.id)}
        >
          <Text style={styles.buttonText}>Delete Table Type</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const calculateTotalCapacity = () => {
    return tables.reduce((sum, table) => sum + (table.capacity * table.quantity), 0);
  };

  return (
    <FormSection title="Tables">
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        Add different types of tables your restaurant offers, such as two-person tables, family tables, or outdoor seating.
      </Text>

      {editingTable ? (
        renderTableEditor(tables.find(table => table.id === editingTable)!)
      ) : (
        <>
          <View style={styles.totalCapacityContainer}>
            <Text style={[styles.totalCapacityLabel, { color: colors.textSecondary }]}>
              Total Seating Capacity:
            </Text>
            <Text style={[styles.totalCapacity, { color: colors.text }]}>
              {calculateTotalCapacity()} seats
            </Text>
          </View>

          <View style={styles.tablesGrid}>
            {tables.map(table => (
              <TouchableOpacity 
                key={table.id}
                style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setEditingTable(table.id)}
              >
                {table.image ? (
                  <Image
                    source={{ uri: table.image }}
                    style={styles.tableImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.tablePlaceholder, { backgroundColor: colors.background }]}>
                    <Feather name="coffee" size={32} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.tableCardContent}>
                  <Text style={[styles.tableName, { color: colors.text }]}>
                    {table.name}
                  </Text>
                  <Text style={[styles.tableInfo, { color: colors.textSecondary }]}>
                    {table.capacity} seats × {table.quantity} tables
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.editButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={() => setEditingTable(table.id)}
                >
                  <Feather name="edit-2" size={16} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[styles.addTableCard, { borderColor: colors.border }]}
              onPress={addTable}
            >
              <Feather name="plus" size={24} color={colors.primary} />
              <Text style={[styles.addTableText, { color: colors.primary }]}>
                Add Table Type
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </FormSection>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  tableEditorContainer: {
    marginTop: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfColumn: {
    width: '48%',
  },
  imageUploader: {
    height: 160,
    marginBottom: 16,
  },
  totalCapacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  totalCapacityLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalCapacity: {
    fontSize: 16,
    fontWeight: '700',
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tableCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tableImage: {
    width: '100%',
    height: 100,
  },
  tablePlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCardContent: {
    padding: 12,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tableInfo: {
    fontSize: 13,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
  },
  addTableCard: {
    width: '48%',
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTableText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  deleteButton: {
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});