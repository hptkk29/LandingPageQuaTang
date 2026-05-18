export type LeadApiSuccess = {
  ok: true;
  message: string;
};

export type LeadApiError = {
  ok: false;
  error: string;
  message?: string;
  fields?: string[];
};

export type LeadApiResponse = LeadApiSuccess | LeadApiError;
