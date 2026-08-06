import React, {useEffect, useState} from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {ferzlAccountService} from '../../services';

const SummaryCard = styled(Card)({
    textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none',
    },
});

const SummaryCardMedia = styled(CardMedia)({
    paddingTop: '56.25%',
});

const initialForm = {
    received: '',
    notReceivedReason: '',
    receivedAt: '',
    hasAccess: '',
    responsiblePhone: '',
    note: '',
};

function apiErrorMessage(error) {
    const data = error && error.error && error.error.data;

    if (data && data.errors) {
        const firstField = Object.keys(data.errors)[0];
        if (firstField && data.errors[firstField] && data.errors[firstField][0]) {
            return data.errors[firstField][0];
        }
    }

    return (data && data.message) || 'Не удалось сохранить сведения. Повторите попытку.';
}

let cachedStatusToken = null;
let cachedStatusPromise = null;

function getStatus(token) {
    if (cachedStatusToken !== token || !cachedStatusPromise) {
        cachedStatusToken = token;
        cachedStatusPromise = ferzlAccountService.getStatus().catch((error) => {
            if (cachedStatusToken === token) {
                cachedStatusToken = null;
                cachedStatusPromise = null;
            }
            throw error;
        });
    }

    return cachedStatusPromise;
}

export function FerzlAccountPrompt() {
    const token = useSelector((store) => store.authReducer.user?.token);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setOpen(false);
            return undefined;
        }

        let active = true;

        getStatus(token).then((data) => {
            if (!active) {
                return;
            }

            if (data.report) {
                setForm({
                    received: data.report.is_received ? 'yes' : 'no',
                    notReceivedReason: data.report.not_received_reason || '',
                    receivedAt: data.report.received_at || '',
                    hasAccess: data.report.has_access === true
                        ? 'yes'
                        : (data.report.has_access === false ? 'no' : ''),
                    responsiblePhone: data.report.responsible_phone || '',
                    note: data.report.note || '',
                });
            }

            if (data.scope === 'medical_organization' && data.needs_prompt) {
                setOpen(true);
            }
        }).catch(() => {
            // The temporary feature must not prevent access to the main system.
        });

        return () => {
            active = false;
        };
    }, [token]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setForm((current) => ({
            ...current,
            [field]: value,
            ...(field === 'received' && value === 'no' ? {receivedAt: ''} : {}),
            ...(field === 'received' && value === 'yes' ? {notReceivedReason: ''} : {}),
        }));
        setError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');

        if (!form.received) {
            setError('Укажите, получена ли учетная запись ФЕРЗЛ.');
            return;
        }

        if (form.received === 'yes' && !form.receivedAt) {
            setError('Укажите дату получения учетной записи.');
            return;
        }

        if (form.received === 'no' && !form.notReceivedReason.trim()) {
            setError('Укажите причину, по которой учетная запись не получена.');
            return;
        }

        if (!form.hasAccess) {
            setError('Укажите, есть ли доступ к подсистеме ФЕРЗЛ по сети.');
            return;
        }

        if (!form.responsiblePhone.trim()) {
            setError('Укажите телефон ответственного сотрудника.');
            return;
        }

        setSaving(true);
        ferzlAccountService.save({
            is_received: form.received === 'yes',
            not_received_reason: form.received === 'no'
                ? form.notReceivedReason.trim()
                : null,
            received_at: form.received === 'yes' ? form.receivedAt : null,
            has_access: form.hasAccess === 'yes',
            responsible_phone: form.responsiblePhone.trim(),
            note: form.note.trim() || null,
        }).then(() => {
            setOpen(false);
            setSaving(false);
        }).catch((saveError) => {
            setError(apiErrorMessage(saveError));
            setSaving(false);
        });
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            disableEscapeKeyDown
            aria-labelledby="ferzl-account-dialog-title"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="ferzl-account-dialog-title">
                    Сведения об учетной записи и доступе к ФЕРЗЛ
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{mb: 2}}>
                        Укажите актуальные сведения по вашей медицинской организации.
                        Пока учетная запись не получена, форма будет появляться при каждом новом входе.
                    </DialogContentText>

                    <DialogContentText sx={{mb: 2}}>
                        Под доступом понимается наличие связи с ресурсом подсистемы ФЕРЗЛ
                        по сети и возможность открыть сайт.
                    </DialogContentText>

                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    <FormControl required component="fieldset" margin="normal">
                        <FormLabel component="legend">Учетная запись ФЕРЗЛ получена?</FormLabel>
                        <RadioGroup
                            row
                            value={form.received}
                            onChange={handleChange('received')}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Да" />
                            <FormControlLabel value="no" control={<Radio />} label="Нет" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        required={form.received === 'no'}
                        disabled={form.received !== 'no'}
                        multiline
                        minRows={2}
                        margin="normal"
                        label="Причина, по которой учетная запись не получена"
                        value={form.notReceivedReason}
                        onChange={handleChange('notReceivedReason')}
                        inputProps={{maxLength: 2000}}
                    />

                    <TextField
                        fullWidth
                        required={form.received === 'yes'}
                        disabled={form.received !== 'yes'}
                        margin="normal"
                        type="date"
                        label="Дата получения"
                        value={form.receivedAt}
                        onChange={handleChange('receivedAt')}
                        InputLabelProps={{shrink: true}}
                        inputProps={{max: new Date().toLocaleDateString('en-CA')}}
                    />

                    <FormControl required component="fieldset" margin="normal">
                        <FormLabel component="legend">
                            Есть доступ к подсистеме ФЕРЗЛ по сети?
                        </FormLabel>
                        <RadioGroup
                            row
                            value={form.hasAccess}
                            onChange={handleChange('hasAccess')}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Да" />
                            <FormControlLabel value="no" control={<Radio />} label="Нет" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Телефон ответственного сотрудника"
                        value={form.responsiblePhone}
                        onChange={handleChange('responsiblePhone')}
                        inputProps={{maxLength: 64}}
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        margin="normal"
                        label="Примечание"
                        value={form.note}
                        onChange={handleChange('note')}
                        inputProps={{maxLength: 2000}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit" variant="contained" disabled={saving}>
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default function FerzlAccountFeature() {
    const token = useSelector((store) => store.authReducer.user?.token);
    const [scope, setScope] = useState(null);

    useEffect(() => {
        if (!token) {
            setScope(null);
            return undefined;
        }

        let active = true;

        getStatus(token).then((data) => {
            if (active) {
                setScope(data.scope);
            }
        }).catch(() => {
            // The temporary feature must not prevent access to the main system.
        });

        return () => {
            active = false;
        };
    }, [token]);

    if (scope !== 'tfoms') {
        return null;
    }

    return (
        <Grid item xs={12} sm={4} md={3}>
            <SummaryCard component={RouterLink} to="/ferzl-accounts">
                <SummaryCardMedia
                    image="/images/tfoms.png"
                    title="Учетные записи ФЕРЗЛ"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Учетные записи ФЕРЗЛ
                    </Typography>
                    <Typography>
                        Сводные сведения по медицинским организациям
                    </Typography>
                </CardContent>
            </SummaryCard>
        </Grid>
    );
}
