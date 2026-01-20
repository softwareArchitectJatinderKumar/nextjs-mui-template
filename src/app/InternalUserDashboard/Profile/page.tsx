'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

import { instrumentService } from '@/services/instrumentService';
import UserProfileForm, {
  UserProfileFormData
} from './UserProfileForm';
// Ensure this path matches where you saved the Navbar component
import Navbar from '@/components/CIF/TopNavBar'; 

export default function UserProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserProfileFormData>({
    defaultValues: {
      EmailId: '',
      CandidateName: '',
      SupervisorName: '',
      MobileNumber: '',
      InstituteName: '',
      DepartmentName: '',
      IdProofType: '',
      IdProofNumber: '',
      Address: ''
    }
  });

  useEffect(() => {
    const cookieData = Cookies.get('InternalUserAuthData');
    if (!cookieData) {
      // Redirect to login if cookie is missing
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(cookieData);

    instrumentService
      .CIFGetUserDetails(parsed.EmailId)
      .then((res: any) => {
        const user = res?.[0];

        if (!user) {
          console.error('User API returned empty');
          return;
        }

        reset({
          EmailId: parsed.EmailId ?? '',
          CandidateName: user.candidateName ?? parsed.CandidateName ?? '',
          SupervisorName: user.supervisorName ?? '',
          MobileNumber: user.mobileNumber ?? '',
          InstituteName: user.instituteName ?? user.organisation ?? '',
          DepartmentName: user.departmentName ?? parsed.Department ?? '',
          IdProofType: user.idProofType ?? '',
          IdProofNumber: user.idProofNumber ?? '',
          Address: user.address ?? ''
        });

        setIsDataLoaded(true);
      })
      .catch(err => {
        console.error('Fetch user failed', err);
      });
  }, [reset]);

  const onEdit = () => setIsEditMode(true);

  const onUpdate = async (uiData: UserProfileFormData) => {
    setLoading(true);
    try {
      const payload = {
        CandidateName: uiData.CandidateName,
        InstituteName: uiData.InstituteName,
        SupervisorName: uiData.SupervisorName,
        MobileNumber: uiData.MobileNumber,
        DepartmentName: uiData.DepartmentName,
        IdProofType: uiData.IdProofType,
        IdProofNumber: uiData.IdProofNumber,
        Address: uiData.Address,
        UserEmail: uiData.EmailId,  
        UpdatedBy: uiData.EmailId
      };

      const response = await instrumentService.UpdateUserDetails(payload);
      
      let finalResult = null;
      if (response?.item1 && Array.isArray(response.item1)) {
          finalResult = response.item1[0];
      } else if (Array.isArray(response)) {
          finalResult = response[0];
      }

      if (finalResult) {
        const { msg, returnId } = finalResult;
        if (msg === 'Success' || returnId > 0) {
          await swal.fire({ title: 'Success', text: 'Details Updated Successfully', icon: 'success' });
          window.location.reload();
        } else if (returnId === -1) {
          await swal.fire({ title: 'Already Submitted', icon: 'error' });
        } else {
          await swal.fire({ title: 'Update Failed', text: msg || 'Error occurred', icon: 'error' });
        }
      } else {
        await swal.fire({
          title: 'Updated',
          text: 'Profile changes saved successfully.',
          icon: 'success'
        }).then(() => window.location.reload());
      }
    } catch (error) {
      console.error("Connection Error:", error);
      swal.fire({ title: 'Error', text: 'Server connection failed', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isDataLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
     
      
      <section className="section py-5 bgLightYellow">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="bgLightYellow shadow-lg border-0">
                <div className="ms-2 border-bottom py-3">
                  <h3 className="card-title mb-0 fw-bold text-primary">
                    <i className="bi bi-person-badge me-2"></i>User Profile
                  </h3>
                </div>
                <div className="card-body p-4">
                  <UserProfileForm
                    register={register}
                    errors={errors}
                    isEditMode={isEditMode}
                    loading={loading}
                    onEdit={onEdit}
                    onSubmit={handleSubmit(onUpdate)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Cookies from 'js-cookie';
// import swal from 'sweetalert2';
// import { useForm } from 'react-hook-form';

// import { instrumentService } from '@/services/instrumentService';
// import UserProfileForm, {
//   UserProfileFormData
// } from './UserProfileForm';
// import Navbar from '@/components/CIF/TopNavBar';

// export default function UserProfilePage() {
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<UserProfileFormData>({
//     defaultValues: {
//       EmailId: '',
//       CandidateName: '',
//       SupervisorName: '',
//       MobileNumber: '',
//       InstituteName: '',
//       DepartmentName: '',
//       IdProofType: '',
//       IdProofNumber: '',
//       Address: ''
//     }
//   });

//   useEffect(() => {
//     const cookieData = Cookies.get('InternalUserAuthData');
//     if (!cookieData) {
//       console.error('Cookie not found');
//       return;
//     }

//     const parsed = JSON.parse(cookieData);

//     instrumentService
//       .CIFGetUserDetails(parsed.EmailId)
//       .then((res: any) => {
//         const user = res?.[0];

//         if (!user) {
//           console.error('User API returned empty');
//           return;
//         }

//         reset({
//           EmailId: parsed.EmailId ?? '',
//           CandidateName: user.candidateName ?? parsed.CandidateName ?? '',
//           SupervisorName: user.supervisorName ?? '',
//           MobileNumber: user.mobileNumber ?? '',
//           InstituteName: user.organisation ?? '',
//           DepartmentName: user.departmentName ?? parsed.Department ?? '',
//           IdProofType: user.idProofType ?? '',
//           IdProofNumber: user.idProofNumber ?? '',
//           Address: user.address ?? ''
//         });

//         setIsDataLoaded(true);
//       })
//       .catch(err => {
//         console.error('Fetch user failed', err);
//       });
//   }, [reset]);

//   const onEdit = () => setIsEditMode(true);

//   const onUpdate = async (uiData: UserProfileFormData) => {
//   setLoading(true);
//   try {
//     const payload = {
//       CandidateName: uiData.CandidateName,
//       InstituteName: uiData.InstituteName,
//       SupervisorName: uiData.SupervisorName,
//       MobileNumber: uiData.MobileNumber,
//       DepartmentName: uiData.DepartmentName,
//       IdProofType: uiData.IdProofType,
//       IdProofNumber: uiData.IdProofNumber,
//       Address: uiData.Address,
//       UserEmail: uiData.EmailId,  
//       UpdatedBy: uiData.EmailId
//     };

//    const response = await instrumentService.UpdateUserDetails(payload);
    
//     let finalResult = null;

//     if (response?.item1 && Array.isArray(response.item1)) {
//         finalResult = response.item1[0];
//     } else if (Array.isArray(response)) {
//         finalResult = response[0];
//     }

//     if (finalResult) {
//       const { msg, returnId } = finalResult;
//       if (msg === 'Success' || returnId > 0) {
//         await swal.fire({ title: 'Success', text: 'Details Updated Successfully', icon: 'success' });
//         window.location.reload();
//       } else if (returnId === -1) {
//         await swal.fire({ title: 'Already Submitted', icon: 'error' });
//       }  else if (msg === 'Failed') {
//         await swal.fire({ title: 'Update Failed', text: msg || 'Error occurred', icon: 'error' });
//       }
//     } else {
//       await swal.fire({
//         title: 'Updated',
//         text: 'Profile changes saved successfully.',
//         icon: 'success'
//       }).then(() => window.location.reload());
//     }

//   } catch (error) {
//     console.error("Connection Error:", error);
//     swal.fire({ title: 'Error', text: 'Server connection failed', icon: 'error' });
//   } finally {
//     setLoading(false);
//   }
// };
 
//   if (!isDataLoaded) {
//     return <div className="text-center mt-5">Loading profile...</div>;
//   }

//   return (
//     <>
//     {/* <Navbar/> */}
    
//     <section className="section">
//       <div className="container">
//         <h1>User Profile</h1>

//         <UserProfileForm
//           register={register}
//           errors={errors}
//           isEditMode={isEditMode}
//           loading={loading}
//           onEdit={onEdit}
//           onSubmit={handleSubmit(onUpdate)}
//         />
//       </div>
//     </section>
//     </>
//   );
// }
