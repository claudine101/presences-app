
import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, Text, Button, Alert, View, useWindowDimensions, TouchableWithoutFeedback, Image, ScrollView } from "react-native";
import { TextField, FilledTextField, InputAdornment, OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import fetchApi from "../../helpers/fetchApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import registerPushNotification from '../../helpers/registerPushNotification';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';


export default function ConnexionScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const { height } = useWindowDimensions()
  const [showPassword, setShowPassword] = useState(false)
  const [users, setUsers] = useState([])

  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null)
  const token = useSelector(notificationTokenSelector)
  const [data, handleChange, setValue] = useForm({
    email: "",
    password: "",
  })
  const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      length: [8]
    }
  }, {
    email: {
      required: "L'email est obligatoire",

      email: "Email invalide"
    },
    password: {
      required: "Le mot de passe est obligatoire",
      length: "Mot de passe trop court"
    }
  })

  const [additioanalErrors, setAdditionalErrors] = useState({})
    ;

  const handleLogin = async () => {
    const user = {
      email: data.email,
      password: data.password,
      PUSH_NOTIFICATION_TOKEN: token,
      // DEVICE: Platform.OS === 'ios' ? 1 : 0
    }

    try {
      setLoading(true)
      const form = new FormData()
      form.append('email', data.email)
      form.append('password', data.password)
      form.append('PUSH_NOTIFICATION_TOKEN', token)
      const userData = await fetchApi(`/auth/users/login`, {
        method: "POST",
        body: form
      })
      await AsyncStorage.setItem("user", JSON.stringify(userData.result));
      dispatch(setUserAction(userData.result))
    }

    catch (error) {
      console.log(error)
      if (error.httpStatus == "NOT_FOUND") {
        setAdditionalErrors(error.result)
      } else {
        setAdditionalErrors({ main: ["Erreur inconnue, réessayer plus tard"] })
      }
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
    {loading && <Loading />}
      <ScrollView keyboardShouldPersistTaps='handled'>
    <View style={styles.container}>
      <Image source={require('../../../assets/images/receca.png')} style={{...styles.image, resizeMode:"center"}}/>
          
          <Text style={styles.title}>Connexion</Text>
      <View style={styles.textField}>
        <Text style={[styles.label, hasError('email') ? styles.errorLabel : null]}>Email</Text>
        <TextInput
        
          value={data.email}
          onChangeText={
            (newValue) => {
              handleChange('email', newValue);
              checkFieldData('email', newValue);
            }
          }
          keyboardType='email-address'
          autoCapitalize='none'
          // style={styles.input}
          style={[styles.input, hasError('email') ? styles.errorInput : null]}
        />
      </View>
      <View style={styles.textField}>
        <Text style={[styles.label, hasError('password') ? styles.errorLabel : null]}>Password</Text>
        <TextInput
          value={data.password}
          onChangeText={(newValue) => {
            handleChange('password', newValue);
            checkFieldData('password', newValue);

          }}
          secureTextEntry
         style={[styles.input, hasError('password') ? styles.errorInput : null]}

        />
      </View>
      <TouchableWithoutFeedback
        disabled={!isValidate()}
        onPress={handleLogin} >
        <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </View>
      </TouchableWithoutFeedback>
      {additioanalErrors.main && <View>
        <View style={styles.button2}>
          <View style={{ marginLeft: 10 }}>
            <AntDesign name="closecircleo" size={24} color="white" />
          </View>
          <View style={{ marginLeft: 10 }}>
            {errors && <Text style={styles.buttonText}>{additioanalErrors.main[0]} </Text>}
          </View>

        </View>
      </View>}
    </View>
  </ScrollView>
  </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },
//   textField: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 4,
//     paddingHorizontal: 8,
//     marginBottom: 16,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  textField: {
    marginBottom: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    marginBottom: 4,
  fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    height: 60,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 20,
  },
  button: {
    // marginTop: 10,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    marginVertical: 20
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  errorLabel: {
    color: 'red', // Couleur du label en cas d'erreur
  },
  image:{
    maxWidth: '80%',
    alignSelf: 'center',
    height: 200,
},
title: {
  fontSize: 25,
  fontWeight: 'bold',
  marginVertical: 25,
  opacity: 0.8,
  color:COLORS.primary,
  paddingHorizontal: 20
},
button2: {
  borderRadius: 8,
  paddingVertical: 14,
  paddingHorizontal: 10,
  backgroundColor: "#D24646",
  marginHorizontal: 40,
  marginTop: 15,
  alignItems: "center",
  flexDirection: "row",
},
});