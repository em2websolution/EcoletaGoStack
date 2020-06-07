import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native' 
import axios from "axios";
import Select from "react-native-picker-select";

interface City {
  nome: string;
}
interface UF {
  sigla: string;
}
interface SelectForm {
  value: string;
  label: string;
}


const Home = () => {
  const navigation = useNavigation();
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const [ufs, setUfs] = useState<SelectForm[]>([]);
  const [cities, setCities] = useState<SelectForm[]>([]);
  const [loading, setLoading] = useState(false);

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      uf,
      city,
    });
  }
  const getUf = async () => {
    axios
      .get<UF[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((response) => {
        const ufInitials = response.data.map((uf) => {
          return {
            value: uf.sigla,
            label: uf.sigla,
          };
        });
        setUfs(ufInitials);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCities = () => {
    if (uf === "") return;
    setLoading(true);
    axios
      .get<City[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => {
          return {
            value: city.nome,
            label: city.nome,
          };
        });
        setCities(cityNames);
      })
      .catch((e) => {
        console.log(e);
      });

    setLoading(false);
  };

  useEffect(() => {
    getUf();
  }, []);
  useEffect(() => {
    getCities();
  }, [uf]);
  const pickerStyle = {
    inputIOS: {
      fontSize: 20,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, 
      marginBottom: 20,
      fontWeight: 'bold',
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30,
    },
    placeholderColor: "black",
    underline: { borderTopWidth: 0 },
    icon: {
      backgroundColor: "#ddd",
      borderTopWidth: 5,
      borderTopColor: "#000000",
      borderRightWidth: 5,
      borderRightColor: "#ddd",
      borderLeftWidth: 5,
      borderLeftColor: "transparent",
      width: 0,
      height: 0,
      top: 20,
      right: 15,
    },
  };

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined }> 
        <ImageBackground 
          source={require('../../assets/home-background.png')} 
          style={styles.container}
          imageStyle={{ width: 274, height: 368 }}
        >
          <View style={styles.main}>
            <Image source={require('../../assets/logo.png')} />  
            <View>
              <Text style={styles.title}> Seu marketplace de coleta de resíduos.</Text>     
              <Text style={styles.description}> Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>     
            </View>
          </View>

          <View style={styles.footer}>
          <Select
          style={pickerStyle}
          placeholder={{
            label: "Selecione um Estado",
            value: "",
          }}
          items={ufs}
          onValueChange={(value) => setUf(value)}
          value={uf}
        />

        {loading ? (
          <Text>Carregando cidades...</Text>
        ) : (
          <Select
            style={pickerStyle}
            placeholder={{
              label: "Selecione uma cidade",
              value: "",
            }}
            items={cities}
            onValueChange={(value) => setCity(value)}
            value={city}
          />
        )}
        
            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color="#fff" size={24} />
                </Text>
              </View>
              <Text style={styles.buttonText}>
                  Entrar
                </Text>
            </RectButton>
          </View>

        </ImageBackground>
      </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home

