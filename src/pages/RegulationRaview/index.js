import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Background from '~/components/Background';
import Regulation from '~/components/Regulation';
import {acceptionRegulation} from '~/store/modules/auth/actions';

import {ApproveButton, ApproveButtonText} from './styles';

export default function RegulationRaview() {
  const dispatch = useDispatch();
  const [privacy] = useState(
    useSelector((state) => state.user.profile.person.privacy),
  );

  // person_id
  const [personId] = useState(
    useSelector((state) => state.user.profile.person.id),
  );

  function handleAcceptRegulation() {
    const newPrivacy = !privacy;
    dispatch(acceptionRegulation(personId, newPrivacy));
  }

  return (
    <Background>
      <Regulation handleAcceptRegulation={handleAcceptRegulation}>
        Aceito os termos
      </Regulation>
      <ApproveButton onPress={handleAcceptRegulation}>
        <ApproveButtonText>Aceito os termos</ApproveButtonText>
      </ApproveButton>
    </Background>
  );
}
