import React from 'react';
// import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Header } from './components/Header'; 
import { authService } from './services';

const Root = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column'
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'auto'
}));

const AppBarSpacer = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function FramePage() {
  // const permissions = useSelector((state) => state.authReducer.user.permissions);

  const allowed = true; // permissions?.includes('monitor reg');

  if (!allowed) {
    return (
      <Root>
        <CssBaseline />
        <Header
          title="Доступ запрещен"
          open={false}
          userName=""
          handleDrawerOpen={() => {}}
          logout={authService.logout}
        />
      </Root>
    );
  }

  return (
    <Root>
      <CssBaseline />
      <Header
        title="Проверка прикрепления"
        open={false}
        userName=""
        handleDrawerOpen={() => {}}
        logout={authService.logout}
      />
      <Content>
        <AppBarSpacer />
        <div style={{ flexGrow: 1 }}>
          <iframe
            src="http://192.168.12.221:8092/oms-policy-check"
            width="100%"
            height="95%"
            style={{ border: 0 }}
            title="monitor-reg-frame"
          >
            Ваш браузер не поддерживает плавающие фреймы!
          </iframe>
        </div>
      </Content>
    </Root>
  );
}