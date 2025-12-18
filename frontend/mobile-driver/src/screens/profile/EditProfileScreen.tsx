import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
// import * as ImagePicker from 'expo-image-picker'; // Commented out to avoid installing native deps if missing
import { Ionicons } from '@expo/vector-icons';
import { profileApi } from '../../api/profile';

export default function EditProfileScreen({ navigation }: any) {
    const [profile, setProfile] = useState<any>({});
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await profileApi.getProfile();
            setProfile(data);
            setImage(data.photo_url);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const pickImage = async () => {
        Alert.alert('Funcionalidade indisponível', 'Em breve você poderá alterar sua foto.');
        /*
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
          return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
        
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
        */
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Upload photo if changed
            if (image && !image.startsWith('http')) {
                await profileApi.uploadPhoto(image);
            }

            // Update profile
            await profileApi.updateProfile(profile);

            Alert.alert('Sucesso', 'Perfil atualizado!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            Alert.alert('Erro', error.response?.data?.detail || 'Não foi possível atualizar o perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Profile Photo */}
                <View style={styles.photoSection}>
                    <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Ionicons name="person" size={60} color="#ccc" />
                            </View>
                        )}
                        <View style={styles.photoEditButton}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoHint}>Toque para alterar a foto</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.field}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.full_name}
                            onChangeText={(text) => setProfile({ ...profile, full_name: text })}
                            placeholder="Seu nome"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.email}
                            editable={false} // Email typically read-only
                            placeholder="seu@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[styles.input, { backgroundColor: '#f0f0f0', color: '#999' }]}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Telefone</Text>
                        <TextInput
                            style={styles.input}
                            value={profile.phone}
                            onChangeText={(text) => setProfile({ ...profile, phone: text })}
                            placeholder="(00) 00000-0000"
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Vehicle Info Note */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Veículo</Text>
                        <Text style={styles.hintText}>Dados do veículo não podem ser alterados pelo app. Entre em contato com o suporte.</Text>

                        <View style={styles.field}>
                            <Text style={styles.label}>Modelo</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={profile.vehicle_model || 'Não informado'}
                                editable={false}
                            />
                        </View>
                        <View style={styles.field}>
                            <Text style={styles.label}>Placa</Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={profile.vehicle_plate || 'Não informado'}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        paddingTop: 60,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoEditButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    photoHint: {
        fontSize: 14,
        color: '#666',
    },
    form: {
        marginBottom: 24,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#666'
    },
    section: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    hintText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 16,
        fontStyle: 'italic'
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
