'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface UserProfileFormData {
  EmailId: string;
  CandidateName: string;
  SupervisorName: string;
  MobileNumber: string;
  InstituteName: string;
  DepartmentName: string;
  IdProofType: string;
  IdProofNumber: string;
  Address: string;
}

interface Props {
  register: UseFormRegister<UserProfileFormData>;
  errors: FieldErrors<UserProfileFormData>;
  isEditMode: boolean;
  loading: boolean;
  onEdit: () => void;
  onSubmit: () => void;
}

const UserProfileForm: React.FC<Props> = ({
  register,
  errors,
  isEditMode,
  loading,
  onEdit,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="row">

        <div className="col-md-6 mb-3">
          <label>Email</label>
          <input
            className="form-control"
            disabled
            {...register('EmailId')}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Name</label>
          <input
            className={`form-control ${errors.CandidateName ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('CandidateName', { required: true })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Supervisor Name</label>
          <input
            className={`form-control ${errors.SupervisorName ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('SupervisorName', { required: true })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Mobile</label>
          <input
            className={`form-control ${errors.MobileNumber ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('MobileNumber', {
              required: true,
              pattern: /^\d{10}$/
            })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Organization</label>
          <input
            className={`form-control ${errors.InstituteName ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('InstituteName', { required: true })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Department</label>
          <input
            className={`form-control ${errors.DepartmentName ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('DepartmentName', { required: true })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>ID Proof Type</label>
          <select
            className={`form-select ${errors.IdProofType ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('IdProofType', { required: true })}
          >
            <option value="">Select</option>
            <option value="AadharCard">Aadhar Card</option>
            <option value="RegistrationCard">Organisation Card</option>
            <option value="PanCard">Pan Card</option>
            <option value="LicenseCard">License Card</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label>ID Proof Number</label>
          <input
            className={`form-control ${errors.IdProofNumber ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('IdProofNumber', { required: true })}
          />
        </div>

        <div className="col-md-12 mb-3">
          <label>Address</label>
          <textarea
            className={`form-control ${errors.Address ? 'is-invalid' : ''}`}
            disabled={!isEditMode}
            {...register('Address', { required: true })}
          />
        </div>

      </div>

      <div className="text-center mt-4">
        {!isEditMode && (
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={onEdit}
          >
            Edit
          </button>
        )}

        {isEditMode && (
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>
    </form>
  );
};

export default UserProfileForm;

