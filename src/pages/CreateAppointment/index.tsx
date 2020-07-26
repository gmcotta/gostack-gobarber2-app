import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Text, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  HourContainer,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export interface ProviderData {
  id: string;
  name: string;
  avatar_url: string;
}
interface RouteParams {
  providerId: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const { user } = useAuth();
  const navigation = useNavigation();

  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then(response => {
      setAvailability(response.data);
    });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectedHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigation.navigate('AppointmentCreated', { date: date.getTime() });
    } catch(error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigation]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabelereiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>

        <ProvidersListContainer>
          <ProvidersList
            horizontal
            contentContainerStyle={{ paddingHorizontal: 24 }}
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName
                  selected={provider.id === selectedProvider}
                >
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              onChange={handleDateChange}
            />
          )}
          <Schedule>
            <Title>Escolha o horário</Title>
            <Section>
              <SectionTitle>Manhã</SectionTitle>
              <SectionContent>
                {morningAvailability.map(
                  ({ formattedHour, available, hour }) => (
                    <HourContainer
                      enabled={available}
                      key={formattedHour}
                      available={available}
                      selected={selectedHour === hour}
                      onPress={() => {handleSelectedHour(hour)}}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </HourContainer>
                  )
                )}
              </SectionContent>
              </Section>
              <Section>
              <SectionTitle>Tarde</SectionTitle>
              <SectionContent>
                {afternoonAvailability.map(
                  ({ formattedHour, available, hour }) => (
                    <HourContainer
                      enabled={available}
                      key={formattedHour}
                      available={available}
                      selected={selectedHour === hour}
                      onPress={() => {handleSelectedHour(hour)}}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </HourContainer>
                  )
                )}
              </SectionContent>
            </Section>
          </Schedule>
        </Calendar>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}

export default CreateAppointment;
