import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import {
  Container,
  Title,
  Description,
  OKButton,
  OKButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const handleOKPressed = useCallback(() => {
    navigation.reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [navigation]);

  const dateFormatted = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy', às' HH:mm'h'", { locale: ptBR });
  }, []);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Agendamento concluído</Title>
      <Description>{dateFormatted}</Description>
      <OKButton onPress={handleOKPressed}>
        <OKButtonText>OK</OKButtonText>
      </OKButton>
    </Container>
  )
}

export default AppointmentCreated;
