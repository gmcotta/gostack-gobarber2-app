import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  Username,
  ProfileButton,
  UserAvatar,
  ProvidersList
} from './styles';

export interface ProviderData {
  id: string;
  name: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const { user } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateToProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <Username>{user.name}</Username>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{uri: user.avatar_url}} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={(provider) => provider.id}
        renderItem={({ item }) => (
          <Username>{item.name}</Username>
        )}
      />
    </Container>
  )
}

export default Dashboard;
