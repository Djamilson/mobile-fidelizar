import React, {useEffect, useState} from 'react';
import {Animated} from 'react-native';
import {useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import {useIsFocused} from '@react-navigation/native';

import api from '~/_services/api';
import Background from '~/components/Background/default';
import Header from '~/components/Header';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import Toast from '~/components/MessageToast';
import Order from '~/components/Order';

import {
  Container,
  Content,
  SubLinhaButton,
  ProfileInfo,
  Name,
  ProfileContainer,
  OrderDeliveredLink,
  OrderWithdrawLink,
  SignLinkText,
  ContentList,
  List,
  PendingLinkText,
} from './styles';

export default function Dashboard({navigation}) {
  const deliveryman = useSelector((state) => state.user.profile);
  const deliverymanId = useSelector(
    (state) => state.user.profile.deliverymanId,
  );
  const [orders, setOrders] = useState([]);
  const isFocused = useIsFocused();

  const animatedValue = new Animated.Value(0);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const [count, setCount] = useState(0);
  const [limit] = useState(3);

  const [orderInfo, setOrderInfo] = useState({});

  function closeToast() {
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  }

  function callToast() {
    setVisible(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start(closeToast());
  }

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    setCount(count + 1);
    try {
      if (loading) return;

      if (!shouldRefresh && page === orderInfo.pages) {
        callToast();
        return;
      }

      if (!shouldRefresh) {
        setLoading(true);
      }

      const res = await api.get(`deliveryman/${deliverymanId}/orders`, {
        params: {
          limit,
          page: `${pageNumber}`,
        },
      });

      setLoading(false);
      const {list} = res.data;

      setPage(pageNumber + 1);
      setOrderInfo(res.data.orderInfo);
      setOrders(shouldRefresh ? list : [...orders, ...list]);
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function refreshList() {
    setOrderInfo({});
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  async function init() {
    setOrderInfo({});
    await loadPage(1, true);
  }

  // para força, pois estava dando error
  useEffect(() => {
    if (isFocused) {
      setOrders([]);
      setVisible(false);
      // refreshList();
      init();
    }
  }, [isFocused, page]);

  // isFocused, page
  /*
  useEffect(() => {
    if (page === 1) {
      setVisible(false);
      init();
    }
  }, []); */

  return (
    <Background>
      <Container>
        <Header navigation={navigation} />
        {!loading && orders.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Ops!! Você não tem entregas cadastradas no momento!
          </Message>
        ) : (
          <Content>
            <ProfileContainer>
              <Name>Entregas</Name>
              <ProfileInfo>
                <OrderDeliveredLink
                  onPress={() => navigation.navigate('Pending')}>
                  <SubLinhaButton>
                    <PendingLinkText>Pendentes</PendingLinkText>
                  </SubLinhaButton>
                </OrderDeliveredLink>
                <OrderWithdrawLink
                  onPress={() => navigation.navigate('OrderDelivered')}>
                  <SignLinkText>Entregues</SignLinkText>
                </OrderWithdrawLink>
              </ProfileInfo>
            </ProfileContainer>
            <ContentList>
              <List
                data={orders}
                keyExtractor={(item) => String(item.ord.id)}
                showsVerticalScrollIndicator={false}
                onRefresh={refreshList}
                refreshing={refreshing}
                onEndReachedThreshold={0.1}
                onEndReached={() => loadPage()}
                renderItem={({item}) => (
                  <Order
                    navigation={navigation}
                    data={item}
                    handleCancel={() => {}}
                    display={Boolean(true)}
                  />
                )}
              />

              <Toast visible={loading} message="Buscando ..." />

              <Toast
                visible={visible}
                message="Ops! Já não temos mais resgistros para buscar."
              />
            </ContentList>
          </Content>
        )}
      </Container>
    </Background>
  );
}

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
