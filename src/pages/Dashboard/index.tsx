import React, { useCallback } from 'react';

import { useAuth } from '../../context/AuthContext';

import {
  Container,
  Header,
  HeaderTitle,
  Username,
  ProfileButton,
  UserAvatar
} from './styles';
import { useNavigation } from '@react-navigation/native';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

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
    </Container>
  )
}

export default Dashboard;
