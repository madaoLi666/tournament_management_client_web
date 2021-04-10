import { ConnectState } from '@/models/connect';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { CurrentProvider, useChangeCurrent, useCurrent } from './context/StepContext';
import StepForm from './stepForm';

function CompleteUnit(props: any) {
  const { history } = props;
  return (
    <CurrentProvider>
      <StepForm history={history} />
    </CurrentProvider>
  );
}

export default connect()(CompleteUnit);
