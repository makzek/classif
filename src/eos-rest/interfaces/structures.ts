import {IEnt, ILinearCL, IHierCL, IStamp} from './interfaces'

// tslint:disable class-name

/**
 * Справочник видов доставки
 */
export interface DELIVERY_CL extends ILinearCL {
    /**
     * Название вида доставки
     */
    CLASSIF_NAME: string;
    /**
     * ISN вида доставки
     */
    ISN_LCLASSIF: number;
     /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Категории адресатов
 */
export interface ADDR_CATEGORY_CL extends ILinearCL {
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
     /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Категории ЭП
 */
export interface EDS_CATEGORY_CL extends ILinearCL {
    /**
     * Название
     */
    CLASSIF_NAME: string;
    /**
     * ISN записи
     */
    ISN_LCLASSIF: number;
     /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Справочник Типы связок
 */
export interface LINK_CL extends ILinearCL {
    /**
     * ISN типа связи
     */
    ISN_LCLASSIF: number;
    /**
     * Имя типа связи
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Тип связки
     */
    LINK_TYPE: number;
    /**
     * Направленность связки
     */
    LINK_DIR: number;
    /**
     * Индекс связки
     */
    LINK_INDEX: string;
    /**
     * ISN парной связи
     */
    ISN_PARE_LINK: number;
    /**
     * Есть доступ к связанному объекту
     */
    TRANSPARENT: number;
}

/**
 * Справочник Номенклатура дел
 */
export interface NOMENKL_CL extends ILinearCL {
    /**
     * ISN дела
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи подразделения
     */
    DUE: string;
    /**
     * Наименование дела
     */
    CLASSIF_NAME: string;
    /**
     * Флаг активности дела
     */
    CLOSED: number;
    /**
     * Год создания записи
     */
    YEAR_NUMBER: number;
    /**
     * Год завершения дела
     */
    END_YEAR: number;
    /**
     * Гриф доступа
     */
    SECURITY: string;
    /**
     * Срок хранения
     */
    STORE_TIME: number;
    /**
     * Срок хранения дела
     */
    SHELF_LIFE: string;
    /**
     * Индекс дела
     */
    NOM_NUMBER: string;
    /**
     * Статья
     */
    ARTICLE: string;
    /**
     * CLOSE_WHO
     */
    CLOSE_WHO: number;
    /**
     * CLOSE_DATE
     */
    CLOSE_DATE: number;
}

/**
 * Справочник Типов организаций
 */
export interface ORG_TYPE_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Типов реестров
 */
export interface REESTRTYPE_CL extends ILinearCL {
    /**
     * ISN типа реестра
     */
    ISN_LCLASSIF: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Имя типа реестра
     */
    CLASSIF_NAME: string;
    /**
     * Категория адресата
     */
    ISN_ADDR_CATEGORY: number;
    /**
     * ISN вид доставки
     */
    ISN_DELIVERY: number;
    /**
     * Признак номерообразования
     */
    FLAG_TYPE: number;
    /**
     * Срочность
     */
    EMERGENCY: string;
    /**
     * Важность
     */
    IMPOTANCE: string;
    /**
     * Партионая почта
     */
    GROUP_MAIL: number;
}

/**
 * Справочник Категорий поручений
 */
export interface RESOLUTION_CATEGORY_CL extends ILinearCL {
    /**
     * ISN категории
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Приоритеты проекта поручения
 */
export interface RESPRJ_PRIORITY_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Статусы проекта поручения
 */
export interface RESPRJ_STATUS_CL extends ILinearCL {
    /**
     * ISN элемента
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Канал передачи сообщений
 */
export interface SEV_CHANNEL extends ILinearCL {
    /**
     * ISN канала передачи сообщений
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование канала передачи
     */
    CLASSIF_NAME: string;
}

/**
 * Участник СЭВ
 */
export interface SEV_PARTICIPANT extends ILinearCL {
    /**
     * ISN участника МЭДО
     */
    ISN_LCLASSIF: number;
    /**
     * DUE организации
     */
    DUE_ORGANIZ: string;
    /**
     * Канал передачи сообщений
     */
    ISN_CHANNEL: number;
    /**
     * Именование участника МЭДО
     */
    CLASSIF_NAME: string;
    /**
     * Адрес
     */
    ADDRESS: string;
}

/**
 * Событие в докладе
 */
export interface SEV_REPORT_EVENT extends ILinearCL {
    /**
     * ISN события
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование события
     */
    CLASSIF_NAME: string;
}

/**
 * Правило СЭВ
 */
export interface SEV_RULE extends ILinearCL {
    /**
     * ISN правил
     */
    ISN_LCLASSIF: number;
    /**
     * Вид правила
     */
    RULE_KIND: number;
    /**
     * Наименование правила МЭДО
     */
    CLASSIF_NAME: string;
    /**
     * Группа документов
     */
    DUE_DOCGROUP: string;
}

/**
 * Ограничения шаблонов номерообразования
 */
export interface SHABLON_DETAIL extends ILinearCL {
    /**;
     * ISN типа связи
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи группы
     */
    DUE: string;
    /**
     * Элемент шаблона
     */
    ELEMENT: string;
    /**
     * тип органичения
     */
    CONSTR_TYPE: string;
}

/**
 * Виды подписей (ЭП)
 */
export interface SIGN_KIND_CL extends ILinearCL {
    /**
     * ISN элемента
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Текст подписи
     */
    SIGN_TEXT: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Состояния исполнения (Контролера)
 */
export interface STATUS_EXEC_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
 * Справочник Состояния исполнения (Исполнителя)
 */
export interface STATUS_REPLY_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}


/**
 * Группы документов пользователя
 */
export interface USER_CARD_DOCGROUP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи ДЛ_картотеки
     */
    DUE_CARD: string;
    /**
     * Код Дьюи группы док
     */
    DUE: string;
    /**
     * FUNC_NUM
     */
    FUNC_NUM: number;
    /**
     * Разрешение
     */
    ALLOWED: number;
}

/**
 * Справочник Пользователей
 */
export interface USER_CL extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Идентификатор
     */
    CLASSIF_NAME: string;
    /**
     * Должностное лицо
     */
    DUE_DEP: string;
    /**
     * Подразделение пользователя
     */
    TECH_DUE_DEP: string;
    /**
     * Имя пользователя
     */
    SURNAME_PATRON: string;
    /**
     * Ид ORACLE
     */
    ORACLE_ID: string;
    /**
     * Доступные системы
     */
    AV_SYSTEMS: string;
    /**
     * Права в ДЕЛЕ абсолютные
     */
    DELO_RIGHTS: string;
    /**
     * Было неудачных попыток входа
     */
    LOGIN_ATTEMPTS: number;
}

/**
 * Доступ пользователей к группам документов
 */
export interface USER_DOCGROUP_ACCESS extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи группы
     */
    DUE: string;
    /**
     * Разрешения доступа
     */
    ALLOWED: number;
}

/**
 * Права ведения внешних резолюций для организаций
 */
export interface USER_ORGANIZ extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи организации
     */
    DUE: string;
    /**
     * Номер функции
     */
    FUNC_NUM: number;
    /**
     * Вес
     */
    WEIGHT: number;
}

/**
 * Ограничения прав пользователей по группам документов
 */
export interface USER_RIGHT_DOCGROUP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * номер права
     */
    FUNC_NUM: number;
    /**
     * DUE группы документов
     */
    DUE: string;
    /**
     * Разрешено
     */
    ALLOWED: number;
}

/**
 * Права пользователей на справочниках
 */
export interface USER_TECH extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * номер права
     */
    FUNC_NUM: number;
    /**
     * Дюе
     */
    DUE: string;
    /**
     * ID справочника
     */
    CLASSIF_ID: number;
    /**
     * Разрешение
     */
    ALLOWED: number;
}

/**
 * Картотечные права пользователя
 */
export interface USERCARD extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * Код Дьюи ДЛ_картотеки
     */
    DUE: string;
    /**
     * Признак гл картотеки
     */
    HOME_CARD: number;
    /**
     * Перечень функций
     */
    FUNCLIST: string;
}

/**
 * Перечни ДЛ для абсолютных прав
 */
export interface USERDEP extends ILinearCL {
    /**
     * ISN пользователя
     */
    ISN_LCLASSIF: number;
    /**
     * func_num
     */
    FUNC_NUM: number;
    /**
     * Код Дьюи ДЛ
     */
    DUE: string;
    /**
     * Вес
     */
    WEIGHT: number;
    /**
     * Учитывать вложенные
     */
    DEEP: number;
    /**
     * Разрешено
     */
    ALLOWED: number;
}

/**
 * Справочник Типы визы
 */
export interface VISA_TYPE_CL extends ILinearCL {
    /**
     * ISN_LCLASSIF
     */
    ISN_LCLASSIF: number;
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
    /**
     * Вес элемента
     */
    WEIGHT: number;
}

/**
* Категории доп реквизитов в поиске
*/
export interface AR_CATEGORY extends IHierCL {
    /**
     * Номер уровня
    */
    LAYER: number;
    /**
     * Вес элемента
    */
    WEIGHT: number;
    /**
     * Вид допреквизитов
     */
    KIND: number;
    /**
     * Наименование категории
     */
    CLASSIF_NAME: string;
    /**
     * ISN доп реквизита
     */
    ISN_AR_DESCRIPT: number;
}

/**
* Справочник статусов граждан
*/
export interface CITSTATUS_CL extends IHierCL, IStamp {
    /**
     * Наименование статуса
     */
    CLASSIF_NAME: string;
    /**
     * Код
    */
    CODE: string;
}

/**
* Справочник подразделений (ДЛ)
*/
export interface DEPARTMENT extends IHierCL {
    /**
     * Код Дьюи организации
    */
    DUE_ORGANIZ: string;
    /**
     * ISN контакта
    */
    ISN_CONTACT: number;
    /**
     * Наименование ДЛ
     */
    CLASSIF_NAME: string;
    /**
     * Дата начала действия
     */
    START_DATE: number;
    /**
     * Дата окончания действия
     */
    END_DATE: number;
    /**
     * Фамилия
     */
    SURNAME: string;
    /**
     * Картотека ДЛ
     */
    DEPARTMENT_DUE: string;
    /**
     * ISN кабинета
     */
    ISN_CABINET: number;
    /**
     * Должность|
     */
    DUTY: string;
    /**
     * Порядковый номер в кабинете
     */
    ORDER_NUM: number;
    /**
     * Индекс ДЛ
     */
    DEPARTMENT_INDEX: string;
    /**
     * Признак начальника
     */
    POST_H: number;
    /**
     * Признак образования картотеки
     */
    CARD_FLAG: number;
    /**
     * Наименование картотеки
     */
    CARD_NAME: string;
    /**
     * № местн тел
     */
    PHONE_LOCAL: string;
    /**
     * № тел
     */
    PHONE: string;
    /**
     * Факс
     */
    FAX: string;
    /**
     * E_MAIL
     */
    E_MAIL: string;
    /**
     * № каб
     */
    NUM_CAB: string;
    /**
     * Due связанной организации
     */
    DUE_LINK_ORGANIZ: string;
    /**
     * ISN фотографии
     */
    ISN_PHOTO: number;
}

/**
* Справочник Группы документов
*/
export interface DOCGROUP_CL extends IHierCL {
    /**
     * Наименование группы
    */
    CLASSIF_NAME: string;
    /**
     * Признак нумерации копий
    */
    IS_COPYCOUNT: number;
    /**
     * Вид РК
     */
    RC_TYPE: number;
    /**
     * Индекс группы
     */
    DOCGROUP_INDEX: string;
    /**
     * Признак образования номеров
     */
    DOCNUMBER_FLAG: number;
    /**
     * Шаблон номера документа
    */
    SHABLON: string;
    /**
     * Требуется ЭП
    */
    EDS_FLAG: number;
    /**
     * Требуется шифрование
     */
    ENCRYPT_FLAG: number;
    /**
     * Проверять уникальность
     */
    TEST_UNIQ_FLAG: number;
    /**
     * Разрешение создания РКПД
     */
    PRJ_NUM_FLAG: number;
    /**
     * Шаблон номера проекта документа
    */
    PRJ_SHABLON: string;
    /**
     * Вес в списке для проектов
    */
    PRJ_WEIGHT: number;
    /**
     * Авторегистрация проекта
     */
    PRJ_AUTO_REG: number;
    /**
     * Применять ЭП для подписания проекта
     */
    PRJ_APPLY_EDS: number;
    /**
     * Применять ЭП для визирования проекта
     */
    PRJ_APPLY2_EDS: number;
    /**
     * Применять ЭП для исполнителя проекта
    */
    PRJ_APPLY_EXEC_EDS: number;
    /**
     * Удалять РК проекта после регистрации
     */
    PRJ_DEL_AFTER_REG: number;
    /**
     * Флаг проверки уникальности номера проекта
     */
    PRJ_TEST_UNIQ_FLAG: number;
    /**
     * Конфиденциальность
     */
    ACCESS_MODE: number;
    /**
     * Без редактирования
     */
    ACCESS_MODE_FIXED: number;
    /**
     * флаг Инициативная резолюция
     */
    INITIATIVE_RESOLUTION: number;
}

/**
* Справочник организаций
*/
export interface ORGANIZ_CL extends IHierCL {
    /**
     * Поиск наимен организации
    */
    CLASSIF_NAME_SEARCH: string;
    /**
     * Наименование организации
    */
    CLASSIF_NAME: string;
    /**
     * Город
     */
    CITY: string;
    /**
     * Почтовый адрес
     */
    ADDRESS: string;
    /**
     * Регион
     */
    ISN_REGION: number;
    /**
     * ИНН
    */
    INN: string;
    /**
     * Категория адресата
    */
    ISN_ADDR_CATEGORY: number;
    /**
     * Форма Собственности
     */
    ISN_ORGANIZ_TYPE: number;
    /**
     * поле для формирования выписок для ЦБ
     */
    CODE: string;
    /**
     * Регисрационное свидейтельство
     */
    SERTIFICAT: string;
    /**
     * Юридический Адресс
    */
    LAW_ADRESS: string;
    /**
     * ОКОНХ
    */
    OKONH: string;
    /**
     * ОКПО
     */
    OKPO: string;
    /**
     * Признак новой записи
     */
    NEW_RECORD: number;
    /**
     * Признак использования E_MAIL для всех представителей
     */
    MAIL_FOR_ALL: number;
    /**
     * Почтовый индекс
    */
    ZIPCODE: string;
    /**
     * Полное наименование
     */
    FULLNAME: string;
    /**
     * ОГРН
     */
    OGRN: string;
}


/**
* Справочник Регионов
*/
export interface REGION_CL extends IHierCL {
    /**
     * Наименование
     */
    CLASSIF_NAME: string;
}

/**
* Справочник рубрик
*/
export interface RUBRIC_CL extends IHierCL, IStamp {
    /**
     * Код рубрики_
    */
    CODE: string;
    /**
     * Код рубрики
    */
    RUBRIC_CODE: string;
    /**
     * Наименование темы
     */
    CLASSIF_NAME: string;
}

/**
* Категории осн реквизитов РК и РКПД в поиске
*/
export interface SRCH_CATEGORY extends IHierCL {
    /**
     * Номер уровня
     */
    LAYER: number;
    /**
     * Вес элемента
     */
    WEIGHT: number;
    /**
     * Вид критериев
     */
    KIND: number;
    /**
     * Наименование категории
     */
    CLASSIF_NAME: string;
    /**
     * ISN критерия
     */
    ISN_CRITERY: number;
}

export interface DELO_BLOB extends IEnt {
    ISN_BLOB: number;
    EXTENSION: string;
}

export interface SEV_ASSOCIATION extends IEnt {
    OBJECT_ID: string,
    OBJECT_NAME: string,
    GLOBAL_ID: string,
    OWNER_ID: string,
    SENDER_ID: string
}

export interface CB_PRINT_INFO extends IEnt {
    ISN_OWNER: number,
    OWNER_KIND: number,
    PRINT_SURNAME: string,
    PRINT_SURNAME_DP: string,
    PRINT_DUTY: string,
    PRINT_DEPARTMENT: string,
    DEPARTMENT_RP: string,
    NOT_USE_IN_DUTY: number,
    SURNAME: string,
    NAME: string,
    PATRON: string,
    SURNAME_RP: string,
    NAME_RP: string,
    PATRON_RP: string,
    SURNAME_DP: string,
    NAME_DP: string,
    PATRON_DP: string,
    SURNAME_VP: string,
    NAME_VP: string,
    PATRON_VP: string,
    SURNAME_TP: string,
    NAME_TP: string,
    PATRON_TP: string,
    SURNAME_PP: string,
    NAME_PP: string,
    PATRON_PP: string,
    GENDER: string,
    DUTY_RP: string,
    DUTY_DP: string,
    DUTY_VP: string
}
