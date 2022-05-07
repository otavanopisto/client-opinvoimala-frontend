declare namespace API {
  type GeneralResponse<T> = Success<T> | Problem;

  type Success<T> = { kind: 'ok'; data: T };

  type Problem =
    // Times up.
    | { kind: 'timeout'; temporary: true; data?: any }
    // Cannot connect to the server for some reason.
    | { kind: 'cannot-connect'; temporary: true; data?: any }
    // The server experienced a problem. Any 5xx error.
    | { kind: 'server'; data?: any }
    // We're not allowed because we haven't identified ourself. This is 401.
    | { kind: 'unauthorized'; data?: any }
    // We don't have access to perform that request. This is 403.
    | { kind: 'forbidden'; data?: any }
    // Unable to find that resource.  This is a 404.
    | { kind: 'not-found'; data?: any }
    // All other 4xx series errors.
    | { kind: 'rejected'; data?: any }
    // Something truly unexpected happened. Most likely can try again. This is a catch all.
    | { kind: 'unknown'; temporary: true; data?: any }
    // The data we received is not in the expected format.
    | { kind: 'bad-data'; data?: any };

  /**
   * API REQUESTS
   */

  type AuthRegister = {
    email: string;
    password: string;
    termsAccepted: boolean;
  };

  type AuthLogin = {
    identifier: string;
    password: string;
  };

  type AuthChangePassword = {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  };

  type AuthForgotPassword = {
    email: string;
  };

  type AuthResetPassword = {
    code: string;
    password: string;
    passwordConfirmation: string;
  };

  type AuthLogin = {
    identifier: string;
    password: string;
  };

  type DeleteAccount = {};

  type GetSettings = {};
  type GetNavigation = {};
  type GetFrontPage = {};
  type GetContentPages = {
    id?: number;
    slug?: string;
  };
  type GetAppointments = {
    status?: 'available' | 'booked' | 'cancelled' | 'hidden';
    start_time_gte?: string;
    start_time_lte?: string;
    end_time_gte?: string;
    end_time_lte?: string;
  };
  type GetUserAppointments = {};
  type MakeAppointment = {
    id: number;
    name: string;
    email: string;
  };
  type CancelAppointment = {
    id: number;
  };

  type GetTestCategories = {};
  type GetExercises = {};
  type GetTests = {
    id?: number;
    slug?: string;
  };
  type CreateTestOutcome = {
    slug: string;
    answers: {
      answerId?: number;
      answer?: string;
      questionId: number;
    }[];
  };
  type GetTestOutcome = {
    slug: string;
  };
  type GetTestsSummary = {};

  /**
   * API RESPONSES
   */
  declare namespace RES {
    type User = {
      id: number;
    };

    type Auth = {
      jwt: string;
      user: User;
    };

    type AuthForgotPassword = { ok: boolean };
    type DeleteAccount = {};

    type GetSettings = import('../../store/SettingsStore').Settings;
    type GetNavigation = import('../../store/NavigationStore').Navigation;
    type GetFrontPage = import('../../store/FrontPageStore').FrontPage;
    type GetContentPage = import('../../store/models').Page;
    type GetContentPages = import('../../store/models').Page[];
    type GetAppointments = import('../../store/models').Appointment[];
    type GetUserAppointments = import('../../store/models').Appointment[];
    type CancelAppointment = { ok: boolean };
    type MakeAppointment = {
      data: import('../../store/models').Appointment;
    };
    type GetTestCategories = import('../../store/models').TestCategory[];
    type GetExercises = import('../../store/models').SimpleTest[];
    type GetTests = import('../../store/models').Test[];
    type CreateTestOutcome = import('../../store/models').TestOutcomes;
    type GetTestOutcome = import('../../store/models').TestOutcomes;
    type GetTestsSummary = import('../../store/models').TestsSummary;
  }

  declare namespace Admin {
    type Login = {
      email: string;
      password: string;
    };
    type GetAppointmentSpecialists = {};
    type CreateAppointment = import('../../store/models').AppointmentIn;
    type EditAppointment = import('../../store/models').AppointmentIn;
    type DeleteAppointment = {
      id: number;
      repeatScope: import('../../store/models').RepeatScope;
    };

    declare namespace RES {
      type Login = {
        token: string;
        user: import('../../store/admin/AdminAuthStore').AdminUser;
      };
      type GetAppointmentSpecialists =
        import('../../store/models').AdminSpecialist[];
      type CreateAppointment = import('../../store/models').Appointment[];
      type EditAppointment = import('../../store/models').Appointment[];
      type DeleteAppointment = { deletedIds: number[] };
    }
  }
}
