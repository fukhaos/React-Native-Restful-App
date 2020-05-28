import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, FlatList } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import api from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteItem = async (id) => {
    try {
      await api.delete(`projects/${id}`);
      const index = projects.findIndex((item) => item.id === id);

      const newProjects = [...projects]; //
      newProjects.splice(index, 1);
      setProjects(newProjects);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await api.get('projects');
        setProjects(data);
      } catch (error) {
        alert(error.message);
      }

      setLoading(false);
    };

    if (loading) {
      getData();
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <FlatList
        onRefresh={() => {
          setLoading(true);
        }}
        refreshing={loading}
        keyExtractor={(item) => `key${item.id}`}
        data={projects}
        renderItem={({ item }) => (
          <ListItem
            bottomDivider
            title={item.title}
            subtitle={`Cod: ${item.id}`}
            onPress={() => navigation.navigate('Detail', { project: item })}
            rightIcon={
              <Icon
                color="gray"
                onPress={() => {
                  deleteItem(item.id);
                }}
                name="delete"
              ></Icon>
            }
          />
        )}
      />
      <Icon
        name="add"
        containerStyle={{
          position: 'absolute',
          right: 20,
          bottom: 20
        }}
        onPress={() => navigation.navigate('Detail')}
        reverse
        color="#f05"
      ></Icon>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
