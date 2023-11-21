export enum ORDER_STATE {
    WAITING_FOR_PAYMENT,
    PAYED,
    PAYMENT_EXPIRED,
    IN_HAND,
    SENT,
    RECEIVED,
}

export enum ORDER_STEP {
    GREETINGS,
    SELECT_FILES,
    REVIEW_ORDER,
    FILL_ADDRESS_INFO,
    PAY,
    THANKS,
}

export enum PAGE_SIZE {
    A5,
    A4,
    A3,
}

export enum BOUNDING_SIZE {
    A5_50,
    A5_150,
    A5_250,
    A5_350,
    A5_450,
    A5_550,
    A4_50,
    A4_150,
    A4_250,
    A4_350,
    A4_450,
    A4_550,
    A3_50,
    A3_150,
    A3_250,
    A3_350,
    A3_450,
    A3_550,
}

export enum COLOR_MODE {
    BLACK_WHITE_LASER,
    COLOR_LASER,
    COLOR_INK,
    COLOR_DIGITAL,
}

export enum PRINT_SIDE {
    ONE_SIDED,
    TWO_SIDED,
}