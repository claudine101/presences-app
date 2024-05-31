import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, FlatList, TouchableNativeFeedback } from "react-native";
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import moment from 'moment'



/**
 * Screen pour la listes des volume planifier pour vous
 * @author claudine NDAYISABA <claudine@mediabox.bi>
 * @date 1/08/2023
 * @returns 
 */
export default function PresenceScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    const [allPresences, setPresences] = useState([])
    const [nbre, setNbre] = useState(null)
    const [title, setTitle] = useState(user?.USERNAME)

    const [loading, setLoading] = useState(false)
    //fonction pour recuperer les presences  de l'utilisateur connecte
    useFocusEffect(useCallback(() => {
        (async () => {
            try {

                setLoading(true)
                const presences = await fetchApi(`/auth/users/presences`)
                setPresences(presences.result)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [user]))

    //fonction pour recuperer les presences  de l'utilisateur connecte
    useFocusEffect(useCallback(() => {
        (async () => {
            try {

                setLoading(true)
                const presences = await fetchApi(`/auth/users/nbreScan`)
                setNbre(presences.result.Nbre)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [user]))
    //Fonction pour ajouter un volume
    const onPressAdd = () => {
        navigation.navigate("ScanPresenceScreen")
    }

    return (
        <>
            <AppHeader title={title} />
            <View style={styles.container}>
                {loading ? <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating size={'large'} color={'#777'} />
                </View> : allPresences.length <= 0 ?
                    <View style={styles.emptyContainer}>
                        <Image source={require("../../../assets/images/empty-folio.png")} style={styles.emptyImage} />
                        <Text style={styles.emptyLabel}>Aucun prsence trouvé</Text>
                    </View>
                    :

                    <FlatList
                        style={styles.contain}
                        data={allPresences}

                        renderItem={({ item: presence, index }) => {
                            // Convertir la date de présence en objet Date
                            const datePresence = new Date(presence?.DATE_PRESENCE);

                            // Extraire l'heure, les minutes et les secondes
                            const heure = datePresence.getHours();
                            const minute = datePresence.getMinutes();
                            const seconde = datePresence.getSeconds();
                            // Définir l'heure cible (07:30)
                            const heureCible = 7;
                            const minuteCible = 40;

                            return (
                                <>
                                    {loading ? (
                                        <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                            <ActivityIndicator animating size={'large'} color={'#777'} />
                                        </View>
                                    ) : (
                                        <TouchableNativeFeedback
                                            useForeground
                                            background={TouchableNativeFeedback.Ripple(COLORS.handleColor)}
                                        // onPress={() => navigation.navigate(nextRouteName, { presence: presence })}
                                        >
                                            <View style={{ marginTop: 10, marginHorizontal: 5, overflow: 'hidden', borderRadius: 8 }}>
                                                <View style={styles.folio}>
                                                    <View style={styles.folioLeftSide}>
                                                        <View style={styles.folioImageContainer}>
                                                            <Image source={require("../../../assets/images/presence.png")} style={styles.folioImage} />
                                                        </View>
                                                        <View style={styles.folioDesc}>
                                                            <Text style={styles.folioName}>{moment(presence?.DATE_PRESENCE).format('DD/MM/YYYY')}</Text>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                        {moment(presence?.DATE_PRESENCE).format('HH:mm ')}
                                                                        {/* {minute} */}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Text style={[styles.folioSubname, { marginLeft: 3 }]}>
                                                                        {presence?.avant}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Ionicons name="checkmark-done-circle" size={24} color="green" />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )}
                                </>
                            );
                        }}
                        keyExtractor={(presence, index) => index.toString()}
                    />
                }
            </View>
            {((moment(new Date()).get("hours") >=12 && nbre== 1) || nbre == 0) ? <View style={[styles.amountChanger]}>
                <TouchableOpacity onPress={onPressAdd} >
                    <Text style={styles.amountChangerText}>+</Text>
                </TouchableOpacity>
            </View> : null}




        </>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    actionIcon: {
        width: 45,
        height: 45,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionLabel: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        fontWeight: 'bold',
    },
    action: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    emptyContaier: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    emptyTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        fontSize: 15
    },
    emptyDesc: {
        color: '#777',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 20
    },
    cardDetails: {
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#c4c4c4',
        marginTop: 10,
        backgroundColor: '#FFF',
        padding: 10,
        overflow: 'hidden',
        marginHorizontal: 10
    },
    carddetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImages: {
        backgroundColor: '#DCE4F7',
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardDescription: {
        marginLeft: 10,
        flex: 1
    },
    itemVolume: {
        fontSize: 15,
        fontWeight: "bold",
    },

    folio: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
    },
    folioLeftSide: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    folioImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center'
    },
    folioImage: {
        width: '60%',
        height: '60%'
    },
    folioDesc: {
        marginLeft: 10,
        flex: 1
    },
    folioName: {
        fontWeight: 'bold',
        color: '#333',
    },
    folioSubname: {
        color: '#777',
        fontSize: 12
    },
    amountChanger: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        position: "absolute",
        left: "80%",
        bottom: 0,
        marginBottom: 10

    },
    amountChangerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: 100,
        height: 100,
        opacity: 0.8
    },
    emptyLabel: {
        fontWeight: 'bold',
        marginTop: 20,
        color: '#777',
        fontSize: 16
    },
})