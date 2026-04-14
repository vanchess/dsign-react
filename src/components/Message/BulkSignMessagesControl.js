import React from 'react';

import { Alert, Box, Button, CircularProgress, List, ListItem, ListItemText, Snackbar, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import CertDialog from '../Dialog/CertDialog.js';
import { bulkSignService } from '../../services/bulkSignService.js';
import { messageService } from '../../services/index.js';

export default class BulkSignMessagesControl extends React.Component {
  certDialogSelectedValue = {};
  bulkFiles = [];
  failedFiles = [];
  signCreate = null;

  state = {
    certDialogOpen: false,
    signInProcess: false,
    signProgressCurrent: 0,
    signProgressTotal: 0,
    signProgressText: '',
    signErrors: [],
    signErrorsExpanded: false,
    signSuccessCount: 0,
    toastOpen: false,
    toastSeverity: 'success',
    toastMessage: '',
    showSignErrors: false,
  };

  getReadableSignError = (error) => {
    const rawMessage = error?.message || error || '';

    if (!rawMessage) {
      return 'Не удалось подписать файл';
    }

    if (rawMessage.includes("Cannot read properties of null (reading 'split')")) {
      return 'Ошибка подготовки данных файла к подписанию';
    }

    return rawMessage;
  };

  handleClickBulkSignMessagesCreate = async () => {
    try {
      this.setState({
        toastOpen: false,
        toastMessage: '',
        signInProcess: true,
        signProgressCurrent: 0,
        signProgressTotal: 0,
        signProgressText: 'Подготовка файлов к подписанию...',
        signErrors: [],
        signErrorsExpanded: false,
        signSuccessCount: 0,
      });

      const selectedMessageIds = this.props.selectedMessageIds || [];
      if (!selectedMessageIds.length) {
        this.setState({
          signInProcess: false,
          signProgressText: '',
        });
        return;
      }

      const filesResponses = await Promise.all(
        selectedMessageIds.map((msgId) => messageService.getFiles(msgId))
      );

      const files = filesResponses
        .flatMap((response) => response?.data || [])
        .map((file) => ({
          id: file?.id,
          name: file?.attributes?.name || file?.name || `Файл ${file?.id}`,
        }))
        .filter((file) => file.id);

      const uniqueMap = new Map();
      files.forEach((file) => {
        if (!uniqueMap.has(file.id)) {
          uniqueMap.set(file.id, file);
        }
      });

      this.bulkFiles = Array.from(uniqueMap.values());
      this.failedFiles = [];

      if (!this.bulkFiles.length) {
        this.setState({
          signInProcess: false,
          signProgressCurrent: 0,
          signProgressTotal: 0,
          signProgressText: 'Нет файлов для подписания',
        });
        return;
      }

      this.certDialogSelectedValue = {};
      this.signCreate = this.bulkSignMessagesCreate;

      this.setState({
        certDialogOpen: true,
        signInProcess: false,
        signProgressCurrent: 0,
        signProgressTotal: this.bulkFiles.length,
        signProgressText: `Файлов к подписанию: ${this.bulkFiles.length}`,
      });

      this.props.fetchCert?.();
    } catch (error) {
      console.log('Ошибка подготовки массового подписания:', error);
      this.bulkFiles = [];
      this.failedFiles = [];
      this.setState({
        signInProcess: false,
        certDialogOpen: false,
        signProgressCurrent: 0,
        signProgressTotal: 0,
        signProgressText: 'Ошибка подготовки подписания',
      });
    }
  };

  bulkSignMessagesCreate = async () => {
    try {
      this.setState({
        signInProcess: true,
        signProgressCurrent: 0,
        signProgressTotal: this.bulkFiles.length,
        signProgressText: `Подписание 0 из ${this.bulkFiles.length}`,
        signErrors: [],
        signSuccessCount: 0,
      });

      const result = await bulkSignService.signFiles({
        files: this.bulkFiles,
        cert: this.certDialogSelectedValue.cert,
        onProgress: ({ current, total, fileName }) => {
          const safeFileName = fileName || 'Без имени';
          const shortName = safeFileName.length > 40
            ? `${safeFileName.slice(0, 37)}...`
            : safeFileName;

          this.setState({
            signProgressCurrent: current,
            signProgressTotal: total,
            signProgressText: `Подписание ${current} из ${total}: ${shortName}`,
          });
        },
        onError: (file, error) => {
          console.log(`Ошибка подписи файла ${file?.id}:`, error);
        },
      });

      setTimeout(() => {
        this.setState({
          signProgressCurrent: 0,
          signProgressTotal: 0,
          signProgressText: '',
        });
      }, 3000);

      const signErrors = (result.failed || []).map((item) => ({
        id: item.file?.id,
        name: item.file?.name || `Файл ${item.file?.id}`,
        message: this.getReadableSignError(item.error),
      }));

      this.failedFiles = (result.failed || []).map((item) => item.file);

      this.setState({
        signProgressCurrent: this.bulkFiles.length,
        signProgressTotal: this.bulkFiles.length,
        signProgressText: `Подписано: ${result.success.length}, ошибок: ${result.failed.length}`,
        signErrors,
        signErrorsExpanded: false,
        showSignErrors: !!signErrors.length,
        signSuccessCount: result.success.length,
        toastOpen: true,
        toastSeverity: result.failed.length ? 'warning' : 'success',
        toastMessage: result.failed.length
          ? `Подписано: ${result.success.length}, ошибок: ${result.failed.length}`
          : `Успешно подписано файлов: ${result.success.length}`,
      });

      if (result.success.length) {
        this.props.onSignedSuccess?.(result);
      }

      if (!result.failed.length) {
        this.bulkFiles = [];
        this.failedFiles = [];
        this.signCreate = null;
      }
    } finally {
      this.setState({ signInProcess: false });
    }
  };

  handleRetryFailedFiles = () => {
    if (!this.failedFiles?.length) {
      return;
    }

    this.bulkFiles = [...this.failedFiles];
    this.signCreate = this.bulkSignMessagesCreate;

    this.setState({
      toastOpen: false,
      toastMessage: '',
      signErrors: [],
      signErrorsExpanded: false,
      signSuccessCount: 0,
      signProgressCurrent: 0,
      signProgressTotal: this.bulkFiles.length,
      signProgressText: `Файлов к повторному подписанию: ${this.bulkFiles.length}`,
      certDialogOpen: true,
    });

    this.props.fetchCert?.();
  };

  handleCloseSignErrors = () => {
    this.setState({ showSignErrors: false });
  };

  handleSignErrorsAccordionChange = (_, expanded) => {
    this.setState({ signErrorsExpanded: expanded });
  };

  handleCloseCertDialog = (value) => {
    this.certDialogSelectedValue = value;

    this.setState({
      certDialogOpen: false,
    });

    if (!this.certDialogSelectedValue || !this.certDialogSelectedValue.cert) {
      this.bulkFiles = [];
      this.setState({
        signInProcess: false,
        signProgressCurrent: 0,
        signProgressTotal: this.failedFiles.length ? this.failedFiles.length : 0,
        signProgressText: '',
      });
      return;
    }

    if (typeof this.signCreate === 'function') {
      this.signCreate();
    }
  };

  render() {
    const { selectedMessageIds = [] } = this.props;

    return (
      <>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={
                !selectedMessageIds.length ||
                this.state.signInProcess ||
                this.state.certDialogOpen
              }
              startIcon={
                this.state.signInProcess || this.state.certDialogOpen
                  ? <CircularProgress size={18} color="inherit" />
                  : <HowToRegIcon />
              }
              onClick={this.handleClickBulkSignMessagesCreate}
            >
              Подписать ЭП
            </Button>

            {!!this.state.signProgressText && (
              <Typography variant="body2">
                {this.state.signProgressText}
              </Typography>
            )}
          </Box>

          {!!this.state.signProgressTotal && (
            <Box sx={{ mt: 1, width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={
                  this.state.signProgressTotal
                    ? (this.state.signProgressCurrent / this.state.signProgressTotal) * 100
                    : 0
                }
              />
            </Box>
          )}

          {!this.state.signErrors.length && this.state.signSuccessCount > 0 && !this.state.signInProcess && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Успешно подписано файлов: {this.state.signSuccessCount}
              </Alert>
            </Box>
          )}

          {!!this.state.signErrors.length && this.state.showSignErrors && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error" onClose={this.handleCloseSignErrors}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Не все файлы удалось подписать. Проверьте список ошибок ниже.
                </Typography>

                <Accordion
                  expanded={this.state.signErrorsExpanded}
                  onChange={this.handleSignErrorsAccordionChange}
                  elevation={0}
                  disableGutters
                  sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:before': {
                      display: 'none',
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      px: 0,
                      minHeight: 'unset',
                      '& .MuiAccordionSummary-content': {
                        margin: '8px 0',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Список ошибок ({this.state.signErrors.length})
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <List dense disablePadding>
                      {this.state.signErrors.map((item) => (
                        <ListItem key={item.id} disableGutters>
                          <ListItemText
                            primary={item.name}
                            secondary={item.message}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={this.handleRetryFailedFiles}
                    disabled={this.state.signInProcess || this.state.certDialogOpen}
                  >
                    Повторить для ошибок
                  </Button>
                </Box>
              </Alert>
            </Box>
          )}
        </Box>

        <CertDialog
          selectedValue={this.certDialogSelectedValue}
          open={this.state.certDialogOpen}
          onClose={this.handleCloseCertDialog}
          selectedCount={selectedMessageIds.length}
        />

        <Snackbar
          open={this.state.toastOpen}
          autoHideDuration={5000}
          onClose={() => this.setState({ toastOpen: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => this.setState({ toastOpen: false })}
            severity={this.state.toastSeverity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {this.state.toastMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }
}
