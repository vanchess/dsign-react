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
    receivedAt: '',
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

export default function FerzlAccountFeature() {
    const [scope, setScope] = useState(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        ferzlAccountService.getStatus().then((data) => {
            if (!active) {
                return;
            }

            setScope(data.scope);

            if (data.report) {
                setForm({
                    received: data.report.is_received ? 'yes' : 'no',
                    receivedAt: data.report.received_at || '',
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
    }, []);

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setForm((current) => ({
            ...current,
            [field]: value,
            ...(field === 'received' && value === 'no' ? {receivedAt: ''} : {}),
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

        if (!form.responsiblePhone.trim()) {
            setError('Укажите телефон ответственного сотрудника.');
            return;
        }

        setSaving(true);
        ferzlAccountService.save({
            is_received: form.received === 'yes',
            received_at: form.received === 'yes' ? form.receivedAt : null,
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
        <>
            {scope === 'tfoms' && (
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
            )}

            <Dialog
                open={open}
                fullWidth
                maxWidth="sm"
                disableEscapeKeyDown
                aria-labelledby="ferzl-account-dialog-title"
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="ferzl-account-dialog-title">
                        Сведения о получении учетной записи ФЕРЗЛ
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{mb: 2}}>
                            Укажите актуальные сведения по вашей медицинской организации.
                            Пока учетная запись не получена, форма будет появляться при каждом новом входе.
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
        </>
    );
}
