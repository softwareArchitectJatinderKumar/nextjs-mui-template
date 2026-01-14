import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  EmailId: yup.string().email('Invalid Email').required('Required').max(150),
  CandidateName: yup.string().required('Required').max(30),
  Supervisorname: yup.string().required('Required').max(30),
  MobileNumber: yup.string().matches(/^\d{10}$/, 'Invalid Mobile Number').required('Required'),
  InstituteName: yup.string().required('Required').max(30),
  DepartmentName: yup.string().required('Required').max(30),
  IdProofType: yup.string().required('Required'),
  IdProofNumber: yup.string().required('Required').max(15),
  Address: yup.string().required('Required').max(150),
  Password: yup.string().required('Required').min(6, 'Min 6 characters').max(15),
  ConfirmPassword: yup.string()
    .oneOf([yup.ref('Password')], 'Passwords do not match')
    .required('Required'),
  UserRole: yup.string().required('Required'),
});