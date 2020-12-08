import React, { Children, useState, ElementType } from 'react';
import { Card, CardContent, Button, Box, Stepper, Step, StepLabel, Grid, MenuItem, Select, InputLabel, FormControl } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import { Formik, Form as FormikForm, Field, FormikConfig, FormikValues } from 'formik';
import { object, number, string } from 'yup';
import './Form.css';
import MaskedInput from 'react-text-mask';
// import * as handler from 'countrycitystatejson';

// https://www.jotform.com/form-templates/authorize-payment-form

const handler = require('countrycitystatejson');

interface MaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}

const ExpirationMaskCustom = (props: MaskCustomProps) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => { inputRef(ref ? ref.inputElement : null); }}
            mask={[/[0-9]/, /[0-9]/, '/', /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
        />
    );
}

const CreditCardMaskCustom = (props: MaskCustomProps) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => { inputRef(ref ? ref.inputElement : null); }}
            mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
            placeholderChar={'\u2000'}
        />
    );
}

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

interface Props {
    
}

const Form = (props: Props) => {

    const [country, setCountry] = useState<string | null>(null);
    const [stateProvince, setStateProvince] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);

    return (
        <Card style={{maxHeight: '500px', maxWidth: '500px'}}>
            <CardContent>
                <FormikStepper 
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        creditCardNumber: '',
                        expirationDate: '',
                        securityCode: '',
                        streetAddress: '',
                        country: '',
                        stateProvince: '',
                        city: '',
                        postalZipCode: '',
                        comment: ''
                    }} onSubmit={async (values) => {
                        await sleep(3000);
                        console.log('Values', values);
                    }}>
                    <FormikStep label='Credit Card' validationSchema={object({
                        firstName: string().matches(/[A-z]+/, 'This field should only contain alphabets!').max(20, 'First name should not be greater than 20 characters.').required('This field is required!'),
                        lastName: string().matches(/[A-z]+/, 'This field should only contain alphabets!').max(20, 'Last name should not be greater than 20 characters.').required('This field is required!'),
                        creditCardNumber: string().matches(/[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]/, 'Invalid credit card number').required('This field is required!').min(17, 'Minimum digits should be 14.').max(19, 'Maximum digits should be 16.'),
                        expirationDate: string().matches(/[0-9][0-9]\u002F[0-9][0-9]/, 'Invalid credit card number').required('This field is required!').length(5, 'Invalid date!'),
                        securityCode: string().required('This field is required!').matches(/[0-9][0-9][0-9][0-9]/,'Security code should be a 4 digit number!')
                    })}>

                        <Grid item container direction='row' alignItems='center' justify='center' spacing={2}>
                            <Grid item xs={12} md={6}>
                        <Box>
                        <Field fullWidth type="text" component={TextField} variant="outlined" label="First Name" name="firstName" id="firstName" />
                        </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                        <Box>
                            <Field fullWidth type="text" component={TextField} variant="outlined" label="Last Name" name="lastName" id="lastName" />
                        </Box>
                            </Grid>
                        </Grid>

                        <Grid item container direction='row' alignItems='center' justify='center' spacing={2}>
                            <Grid item xs={12} md={7}>
                                <Box>
                                    <Field fullWidth type="text" component={TextField} variant="outlined" label="Credit Card Number" name="creditCardNumber" id="creditCardNumber" InputProps={{ inputComponent: CreditCardMaskCustom as any }} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Box>
                                    <Field fullWidth component={TextField} variant="outlined" label="Expiration Date" name="expirationDate" id="expirationDate" InputProps={{ inputComponent: ExpirationMaskCustom as any }} />
                                </Box>
                            </Grid>
                            
                        </Grid>

                        <Grid item container direction='row' alignItems='center' justify='center' spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Box>
                                    <Field fullWidth type="password" component={TextField} variant="outlined" label="Security Code" name="securityCode" id="securityCode" />
                                </Box>
                            </Grid>
                        </Grid>

                    </FormikStep>
                    <FormikStep label='Billing Address' validationSchema={object({
                        streetAddress: string().required('This field is required!'),
                        // country: string().required('Please select a country!'),
                        // stateProvince: string().required('Please select a state/province!'),
                        // city: string().required('Please select a city!'),
                        postalZipCode: number().required('This field is required!').max(99999, 'Invalid postal code!')
                    })}>
                        <Grid item xs={12} md={12}>
                            <Box paddingBottom={2}>
                                <Field multiline fullWidth rows={1} rowsMax={3} type="text" component={TextField} variant="outlined" label="Street Address" name="streetAddress" id="streetAddress" />
                            </Box>
                        </Grid>
                        
                        <Grid item container direction='row' alignItems='center' justify='center' spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="country">Country</InputLabel>
                                    <Field 
                                        component={Select}
                                            variant="outlined" value={country} onChange={(e: any) => {
                                                setCountry(e.target.value);
                                                setStateProvince('');
                                                setCity('');
                                            }} name='country' id='country'>
                                            <MenuItem value={''}><em>None</em></MenuItem>
                                            {handler.getCountries().map(
                                                (country: any) => {
                                            return (
                                                <MenuItem key={country.shortName} value={country.shortName}>{country.name}</MenuItem>
                                                )
                                            })}
                                        </Field>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="stateProvince">State/Province</InputLabel>
                                        <Field
                                            component={Select}
                                            variant="outlined" value={stateProvince} onChange={(e: any) => {
                                                setStateProvince(e.target.value);
                                                setCity('');
                                            }} 
                                            name="stateProvince" id='stateProvince'>
                                            <MenuItem value={''}><em>None</em></MenuItem>
                                            {country && handler.getStatesByShort(country).map((state: any) => <MenuItem key={state} value={state}>{state}</MenuItem>)}
                                        </Field>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid item container direction='row' alignItems='center' justify='center' spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="city">State/Province</InputLabel>
                                        <Field
                                            component={Select}
                                            variant="outlined" value={city} onChange={(e: any) => {
                                                setCity(e.target.value);
                                            }}
                                            name="city" id='city'>
                                            <MenuItem value={''}><em>None</em></MenuItem>
                                            {country && stateProvince && handler.getCities(country, stateProvince).map((city: any) => <MenuItem key={city} value={city}>{city}</MenuItem>)}
                                        </Field>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box>
                                    <Field fullWidth type="number" component={TextField} variant="outlined" label="Postal/Zip Code" name="postalZipCode" id="postalZipCode" />
                                </Box>
                            </Grid>
                        </Grid>

                    </FormikStep>
                    <FormikStep label='Comments'>
                        <Grid item xs={12} md={12}>
                        <Box paddingBottom={2}>
                                <Field fullWidth multiline autoComplete rows={7} rowsMax={8} type="text" component={TextField} variant="outlined" label="Comment" name="comment" id="comment" helperText="*Optional"/>
                        </Box>
                        </Grid>
                    </FormikStep>
                </FormikStepper> 
            </CardContent>
        </Card>
    )
}

export default Form;

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
    label: string;
}

export const FormikStep = ({ children }: FormikStepProps) => {
    return <>{children}</>;
}

export const FormikStepper = ({children, ...props}: FormikConfig<FormikValues>) => {
    const childrenArray = Children.toArray(children) as ElementType<FormikStepProps>[];
    const [step, setStep] = useState(0);
    const currentChild = childrenArray[step];
    // console.log(currentChild);

    const isLastStep = () => {
        return step === childrenArray.length - 1;
    };

    return (
        <Formik {...props}
            validationSchema={
                // @ts-expect-error
                currentChild.props.validationSchema
            }
            onSubmit={async (values, helpers) => {
                console.log(values);
            if (isLastStep()) {
                await props.onSubmit(values, helpers);
            } else {
                setStep(s => s + 1);
            }
            }} >
            {({ isSubmitting }) => (
            <FormikForm autoComplete='off'>
                <Stepper activeStep={step} alternativeLabel>
                    {childrenArray.map((child) => (
                        <Step key={
                            // @ts-expect-error
                            child.props.label
                        }>
                            <StepLabel>{
                                // @ts-expect-error
                                child.props.label
                            }</StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                    {currentChild}
                    
                    <Grid item container direction='row' alignItems='flex-end' justify='center' spacing={2}>
                        <Grid item>
                            <Button style={{width: '100px'}} variant='contained' color='primary' onClick={() => {
                                setStep(s => s - 1);
                            }} disabled={(step < 1) || isSubmitting}>Back</Button>
                        </Grid>
                        <Grid item>
                            <Button style={{ width: '100px' }} variant='contained' color='primary' type='submit' disabled={isSubmitting}>{isSubmitting ? 'Submiting...' : isLastStep() ? 'Submit' : 'Next'}</Button>
                        </Grid>
                </Grid>
                </FormikForm>
            )}
        </Formik>
    )
}
