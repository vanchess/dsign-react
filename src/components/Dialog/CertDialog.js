import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { blue } from '@mui/material/colors';

import { useSelector } from 'react-redux';
import { styled } from '@mui/material';

const AvatarStyled = styled(Avatar)`
    background-color: ${blue[100]};
    color: ${blue[600]};
`;

function CertDialog(props) {
  const items = useSelector(store => store.cadespluginReducer.items);
  const { onClose, selectedValue, open, selectedCount } = props;

  const [agreed, setAgreed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setAgreed(false);
      setConfirmed(false);
    }
  }, [open]);

  const handleClose = () => {
    setAgreed(false);
    setConfirmed(false);
    onClose(selectedValue);
  };

  const handleCancel = () => {
    setAgreed(false);
    setConfirmed(false);
    onClose(selectedValue);
  };

  const handleContinue = () => {
    if (!agreed) {
      return;
    }
    setConfirmed(true);
  };

  const handleBack = () => {
    setConfirmed(false);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  const filteredItems = items.filter((item) => user?.snils == item.snils);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="cert-dialog-title"
      aria-modal="true"
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="cert-dialog-title">
        {confirmed ? 'Выберите сертификат' : 'Подтверждение подписания'}
      </DialogTitle>

      <DialogContent dividers>
        {!confirmed ? (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                ВНИМАНИЕ!
              </Typography>
              {(!!selectedCount &&
              <Typography variant="body2" sx={{ mb: 1 }}>
                Вы выбрали <b>{selectedCount}</b> сообщений для подписания.
              </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                Нажимая кнопку <b>«Продолжить»</b>, вы подтверждаете, что ознакомлены с документами
                и осознаете юридические последствия их подписания.
              </Typography>
              <Typography variant="body2">
                Информация в электронной форме, подписанная <b>квалифицированной электронной подписью</b>,
                признается электронным документом, равнозначным 
                документу на бумажном носителе, подписанному собственноручной подписью (Федеральный закон № 63-ФЗ от 06.04.2011)
              </Typography>
            </Alert>

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              }
              label="Я ознакомлен(а) и подтверждаю согласие"
            />
          </Box>
        ) : (
          <Box>
            {!filteredItems.length && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Доступные сертификаты не найдены.
              </Alert>
            )}

            <List sx={{ pt: 0 }}>
              {filteredItems.map((item, index) => (
                <React.Fragment key={item.thumbprint}>
                  <ListItem disablePadding alignItems="flex-start">
                    <ListItemButton onClick={() => handleListItemClick(item)} alignItems="flex-start">
                      <ListItemAvatar>
                        <AvatarStyled>
                          <VpnKeyIcon />
                        </AvatarStyled>
                      </ListItemAvatar>

                      <ListItemText
                        primary={item.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                            >
                              {item.secondaryInfoString}
                            </Typography>
                            {item.secondaryInfoString ? <br /> : null}
                            <Typography
                              component="span"
                              variant="body2"
                            >
                              {item.validityString}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItemButton>
                  </ListItem>

                  {index < filteredItems.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {!confirmed ? (
          <>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
            <Button
              onClick={handleContinue}
              variant="contained"
              disabled={!agreed}
            >
              Продолжить
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleBack}>
              Назад
            </Button>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

CertDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedCount: PropTypes.number,
};

export default CertDialog;