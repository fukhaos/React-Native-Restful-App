import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import api from '../services/api';

const DetailScreen = ({ navigation, route }) => {
  const project = route?.params?.project;

  useEffect(() => {
    const getProject = async () => {
      const { data } = await api.get(`projects/${project.id}`);

      setTitle(data.title);
      setDescription(data.description);
      setImage(data.image);
    };

    if (project) {
      getProject();
    }
  }, [project]);

  const [loading, setLoading] = useState(false);
  const [formTitle, setTitle] = useState('');
  const [formDescription, setDescription] = useState('');
  const [formImage, setImage] = useState('');

  const onSubmit = () => {
    if (project) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    setLoading(true);
    try {
      await api.post('projects', {
        title: formTitle,
        description: formDescription,
        image: formImage
      });

      alert('Cadastrado com sucesso');
      //navigation.goBack();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  const onUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`projects/${project.id}`, {
        title: formTitle,
        description: formDescription,
        image: formImage
      });

      alert('Atualizado com sucesso');
      //navigation.goBack();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  const getImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    const manipulator = await ImageManipulator.manipulateAsync(
      result.uri,
      [{ resize: { width: 80, height: 80 } }],
      { base64: true }
    );

    setImage(`data:image/jpg;base64,${manipulator.base64}`);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => getImage()}>
        <Image source={{ uri: formImage }} style={styles.logo}></Image>
      </TouchableOpacity>

      <Input value={formTitle} onChangeText={setTitle} placeholder="Nome do projeto"></Input>
      <Input value={formDescription} onChangeText={setDescription} placeholder="Descrição"></Input>
      <Button loading={loading} onPress={onSubmit} title="Enviar"></Button>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'silver',
    alignSelf: 'center',
    marginBottom: 20
  }
});
