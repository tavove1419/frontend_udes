export interface GetApplicants {
    id:             string;
    program:        string;
    applicant_type: string;
    status:         string;
    created_at:     Date;
    user_name:      string;
    user_last_name: string;
    user_email:     string;
}

export interface InscripcionData {
  datos?: {
    fecha_nacimiento?: string;
    lugar_nacimiento?: string;
    direccion_residencia?: string;
    estrato?: string;
  };
  docs?: {
    foto?: string;
    documento_identidad?: string;
    diploma_bachiller?: string;
  };
  encuesta?: {
    motivacion?: string;
    medio_enterado?: string;
    canal_informativo?: string;
  };
}
