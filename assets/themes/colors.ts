// src/theme/colors.ts
export interface HomeScreenColors {
  // Fondo principal: gradiente
  gradientStart: string;
  gradientEnd: string;

  // Header (íconos del menú y notificaciones)
  headerIcon: string; 
  headerIcon1: string;
  headerIcon2: string;

  // Modal de categorías
  modalOverlayBg: string;
  modalContentBg: string;
  modalButtonBg: string;
  modalText: string;

  // Selector “estrella” / “recuadro”
  selectorContainerBg: string;
  selectorButtonBg: string;
  selectorButtonActiveBg: string;
  selectorIconActive: string;
  selectorIconInactive: string;

  // Lista de favoritos (modo lista)
  favListCardBg: string;
  favListText: string;
  favListStatusActive: string;
  favListStatusInactive: string;
  emptyCardBorder: string;
  emptyCardBg: string;
  deleteActionBg: string;

  // IconWrapper (candado en lista)
  iconWrapperBorderActive: string;
  iconWrapperBorderInactive: string;
  iconWrapperBgActive: string;
  iconWrapperBgInactive: string;

  // Círculo principal (modo estrella)
  lockCircleBorderActive: string;
  lockCircleBorderInactive: string;
  lockCircleBgGradientStart: string;
  lockCircleBgGradientEnd: string;
  noMainText: string;

  // Tarjeta principal (info del favorito principal)
  mainCardBg: string;
  mainTitle: string;
  mainSubtitle: string;

  // Botones del drawer
  drawerBg: string;
  handleBg: string;
  drawerItemBg: string;
  drawerLabel: string;

  // Colores comunes
  activityIndicator: string;
  errorText: string;
}


export interface DeviceSelectorColors {
  containerBg: string;
  centerText: string;
  listBg: string;
  rowBg: string;
  rowShadowColor: string;
  iconContainerBg: string;
  iconColor: string;
  nameText: string;
  subText: string;
  emptyText: string;
  backBg: string;
  backText: string;
  activityIndicator: string;
}


export interface SettingsGeneralColors {
  containerBg: string;
  headerBg: string;
  headerText: string;
  iconTint: string;
  sectionTitle: string;
  cardBg: string;
  rowText: string;
  separator: string;
  modalOverlayBg: string;
  modalContainerBg: string;
  modalTitle: string;
  modalOptionText: string;
  modalCancelText: string;   // color de títulos principales, p. ej. "#0B3D91"
subheading: string;     // color de subtítulos, p. ej. "#0B3D91" o un gris oscuro "#4A4A4A"
bullet: string;
}

export interface LoginScreenColors {
  containerBg: string;
  cardBg: string;
  inputBg: string;
  inputBorder: string;
  passwordWrapperBg: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBorder: string;
  buttonSecondaryText: string;
  textDefault: string;
  activityIndicator: string;
  eyeColor: string;  // <— añadimos esta línea
}

export interface RegisterScreenColors {
  containerBg: string;
  cardBg: string;
  titleText: string;
  inputBg: string;
  inputBorder: string;
  inputPlaceholder: string;
  inputErrorBorder: string;
  passwordWrapperBg: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  linkText: string;
  eyeColor: string;
  activityIndicator: string;
  errorText: string;
}


export interface GroupSelectorColors {
  containerBg: string;
  centerText: string;
  listBg: string;
  rowBg: string;
  rowShadowColor: string;
  iconContainerBg: string;
  iconColor: string;
  nameText: string;
  subText: string;
  emptyText: string;
  backBg: string;
  backText: string;
  activityIndicator: string;
}

export interface DevicesScreenColors {
  // Fondo general y cabecera
  containerBg: string;
  headerBg: string;
  headerTitle: string;
  headerIcon: string;
  headerIcon1: string;
  iconButtonActiveBorder: string;
  iconButtonBorder: string;


  // Pantalla carga / error
  centerBg: string;
  activityIndicator: string;
  errorText: string;

  // Lista y texto vacío
  listBg: string;
  emptyListText: string;

  // Tarjeta de dispositivo
  deviceCardBg: string;
  deviceCardShadowColor: string;
  deviceName: string;
  deviceStatus: string;

  // Botón de icono de acción (candado)
  iconButtonBg: string;
  iconButtonActiveBg: string;

  // Botón “Agregar dispositivo”
  addMainButtonBg: string;
  addButtonText: string;

  // Modal para asignar dispositivo
  modalOverlayBg: string;
  modalContentBg: string;
  inputBg: string;
  inputBorder: string;
  modalButtonBg: string;
  modalCancelButtonBg: string;
  modalText: string;
  modalCancelText: string;
}



export interface GroupsScreenColors {
  // Contenedor general y cabecera
  containerBg: string;
  headerBg: string;
  headerTitle: string;
  headerIcon: string;

  // Pantalla de carga / error
  centerBg: string;
  activityIndicator: string;
  errorText: string;

  // Lista y texto vacío
  listBg: string;
  emptyListText: string;

  // Tarjeta de grupo
  groupCardBg: string;
  groupCardShadowColor: string;
  groupNameText: string;
  groupIconColor: string;

  // Botón de candado (lock)
  lockIconBgLocked: string;
  lockIconBgUnlocked: string;
  lockIconBorderLocked: string;
  lockIconBorderUnlocked: string;
  lockIconColorLocked: string;
  lockIconColorUnlocked: string;

  // Botón “Agregar grupo”
  addMainButtonBg: string;
  addButtonText: string;

  // Modal para crear grupo
  modalOverlayBg: string;
  modalContentBg: string;
  inputBg: string;
  inputBorder: string;
  modalButtonBg: string;
  modalCancelButtonBg: string;
  modalText: string;
  modalCancelText: string;
}



export interface DeviceSettingsColors {
  // Contenedor y cabecera
  containerBg: string;
  headerBg: string;
  headerTitle: string;
  headerIcon: string;             // color para BackIcon y NotificationIcon

  // Carga y error
  centerBg: string;
  activityIndicator: string;
  errorText: string;

  // Tarjeta de historial
  cardBg: string;
  cardShadowColor: string;
  cardTitleText: string;
  emptyText: string;

  // Divider en evento
  eventBorderColor: string;
  eventDateText: string;
  eventStatusNotifiedText: string;
  eventStatusRegisteredText: string;
  eventIconNotified: string;
  eventIconRegistered: string;

  // Footer y botón “Atrás”
  footerBg: string;
  primaryButtonBg: string;
  primaryButtonText: string;

  // Modal de renombrar
  modalOverlayBg: string;
  modalContentBg: string;
  modalTitleText: string;
  modalInputBg: string;
  modalInputBorder: string;
  modalButtonBg: string;
  modalCancelButtonBg: string;
  modalText: string;
  modalCancelText: string;
  modalSaveText: string;
}

export interface GroupDetailColors {
  // Contenedor y cabecera
  containerBg: string;
  headerBg: string;
  headerTitle: string;
  headerIcon: string;

  // Carga y pantalla de error
  centerBg: string;
  activityIndicator: string;
  errorText: string;

  // Tarjeta (card) y títulos
  cardBg: string;
  cardShadowColor: string;
  cardTitleText: string;
  statusText: string;

  // Botones primarios (renombrar, añadir, atrás)
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonDisabledBg: string;

  // IconButtons (lock/unlock, delete)
  iconButtonBgDefault: string;
  iconButtonBorderDefault: string;
  iconButtonBgLocked: string;
  iconButtonBorderLocked: string;
  iconButtonBgDelete: string;
  iconButtonBorderDelete: string;
  iconButtonColorLocked: string;
  iconButtonColorUnlocked: string;
  iconButtonColorDelete: string;

  // Texto de grupo/dispositivo
  groupNameText: string;
  deviceNameText: string;
  deviceSerialText: string;

  // Separadores (borders entre elementos)
  separatorColor: string;

  // Modal para seleccionar dispositivo
  modalOverlayBg: string;
  modalContentBg: string;
  modalText: string;
  modalButtonBg: string;

  // Modal para renombrar
  renameModalContentBg: string;
  modalTitleText: string;
  modalInputBg: string;
  modalInputBorder: string;
  modalCancelText: string;
  modalSaveText: string;
  
  emptyText: string;
  eventIconRegistered: string;
  buttonDisabledText: string;
}

export interface WelcomeHelpColors {
  containerBg: string;
  titleText: string;
  subtitleText: string;

  cardBg: string;
  cardShadowColor: string;
  featureTitleText: string;
  featureDescText: string;
  bulletColor: string;
  bulletText: string;

  dotActive: string;
  dotInactive: string;

  buttonBg: string;
  buttonText: string;
}


export const lightColors = {
  // …otras secciones…

  loginScreen: {
    containerBg: '#F0F4FF',
    cardBg: '#DEE4FF',
    inputBg: '#FFFFFF',
    inputBorder: '#C0C4E8',
    passwordWrapperBg: '#FFFFFF',
    buttonPrimaryBg: '#A0B4FF',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBorder: '#A0B4FF',
    buttonSecondaryText: '#A0B4FF',
    textDefault: '#333333',
    activityIndicator: '#A0B4FF',
    eyeColor: '#A0B4FF',
  } as LoginScreenColors,

    settingsGeneral: {
    containerBg: '#F0F4FF',
    headerBg: '#F0F4FF',
    headerText: '#0B3D91',
    iconTint: '#0B3D91',
    sectionTitle: '#0B3D91',
    subheading: '#0B3D91',         // **NUEVO** subtítulos en azul-noche
    bullet: '#7383CA',             // **NUEVO** texto de viñetas en gris mediano
    cardBg: '#DEE4FF',
    rowText: '#0B3D91',
    separator: '#C0C4E8',
    modalOverlayBg: 'rgba(0,0,0,0.4)',
    modalContainerBg: '#FFFFFF',
    modalTitle: '#0B3D91',
    modalOptionText: '#0B3D91',
    modalCancelText: '#A0B4FF',
  } as SettingsGeneralColors,

    registerScreen: {
    containerBg: '#F0F4FF',          // fondo toda la pantalla
    cardBg: '#EFF2FF',               // fondo de la tarjeta
    titleText: '#0B3D91',            // color del título
    inputBg: '#FFFFFF',              // fondo de cada TextInput
    inputBorder: '#C0C4E8',          // borde normal
    inputPlaceholder: '#999999',     // placeholder cuando no hay error
    inputErrorBorder: '#C00',        // borde cuando hay error
    passwordWrapperBg: '#FFFFFF',    // fondo del contenedor de contraseña
    buttonPrimaryBg: '#A0B4FF',      // fondo del botón de “Registrar”
    buttonPrimaryText: '#FFFFFF',    // texto del botón
    linkText: '#A0B4FF',             // color del texto del enlace “¿Ya tienes cuenta?”
    eyeColor: '#0B3D91',             // color del ojo en modo claro
    activityIndicator: '#A0B4FF',    // color del spinner
    errorText: '#C00',               // color para texto de error si lo usaras
  } as RegisterScreenColors,
  // …otras pantallas…

   homeScreen: {
    gradientStart: '#EEF4FF',
    gradientEnd:   '#D7DEFF',

    headerIcon: '#A0B4FF',
    headerIcon1: '#EEF4FF',
    headerIcon2: '#0B3D91',

    modalOverlayBg:   'rgba(0, 0, 0, 0.3)',
    modalContentBg:   '#EFF2FF',
    modalButtonBg:    '#D0DAFF',
    modalText:        '#0B3D91',

    selectorContainerBg:  '#D0DAFF',
    selectorButtonBg:     '#E8EBFF',
    selectorButtonActiveBg: '#A0B4FF',
    selectorIconActive:   '#FFFFFF',
    selectorIconInactive: '#A0B4FF',

    favListCardBg:        '#D0D4FF',
    favListText:          '#0B3D91',
    favListStatusActive:  '#C00',
    favListStatusInactive:'#0B3D91',
    emptyCardBorder:      '#C0C4E8',
    emptyCardBg:          'transparent',
    deleteActionBg:       '#FF6161',

    iconWrapperBorderActive:   '#C00',
    iconWrapperBorderInactive: '#A0B4FF',
    iconWrapperBgActive:       '#EEA6A6',
    iconWrapperBgInactive:     '#E8EBFF',

    lockCircleBorderActive:   '#C00',
    lockCircleBorderInactive: '#A0B4FF',
    lockCircleBgGradientStart:'#F2F5FF',
    lockCircleBgGradientEnd:  '#DCE3FF',
    noMainText:               '#0B3D91',

    mainCardBg:      '#DEE4FF',
    mainTitle:       '#0B3D91',
    mainSubtitle:    '#0B3D91',

    drawerBg:        '#FFFFFF',
    handleBg:        '#CFD6FF',
    drawerItemBg:    '#EFF2FF',
    drawerLabel:     '#0B3D91',

    activityIndicator: '#006E8F',
    errorText:        '#C00',
  } as HomeScreenColors,

    deviceSelector: {
    containerBg: '#F0F4FF',
    centerText: '#0B3D91',
    listBg: 'transparent',           // El FlatList en sí no necesita color de fondo distinto
    rowBg: '#D0D4FF',
    rowShadowColor: '#000',
    iconContainerBg: '#EFF2FF',
    iconColor: '#0B3D91',
    nameText: '#0B3D91',
    subText: '#0B3D91',
    emptyText: '#0B3D91',
    backBg: '#A0B4FF',
    backText: '#FFFFFF',
    activityIndicator: '#A0B4FF',
  } as DeviceSelectorColors,
  
  groupSelector: {
    containerBg: '#F0F4FF',
    centerText: '#0B3D91',
    listBg: 'transparent',
    rowBg: '#D0D4FF',
    rowShadowColor: '#000',
    iconContainerBg: '#EFF2FF',
    iconColor: '#0B3D91',
    nameText: '#0B3D91',
    subText: '#0B3D91',
    emptyText: '#0B3D91',
    backBg: '#A0B4FF',
    backText: '#FFFFFF',
    activityIndicator: '#A0B4FF',
  } as GroupSelectorColors,

devicesScreen: {
    containerBg: '#F0F4FF',
    headerBg: '#F0F4FF',
    headerTitle: '#0B3D91',
    headerIcon: '#A0B4FF',
    
    iconButtonActiveBorder: '#C00',
    iconButtonBorder: '#A495D6',

    centerBg: '#F0F4FF',
    activityIndicator: '#A0B4FF',
    errorText: '#C00',

    listBg: 'transparent',
    emptyListText: '#0B3D91',

    deviceCardBg: '#DEE4FF',
    deviceCardShadowColor: '#000',
    deviceName: '#0B3D91',
    deviceStatus: '#0B3D91',

    iconButtonBg: '#EFF2FF',
    iconButtonActiveBg: '#EEA6A6',

    addMainButtonBg: '#A0B4FF',
    addButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#EFF2FF',
    inputBg: '#FFFFFF',
    inputBorder: '#C0C4E8',
    modalButtonBg: '#D0DAFF',
    modalCancelButtonBg: '#FFD0D7',
    modalText: '#0B3D91',
    modalCancelText: '#C00',
  } as DevicesScreenColors,

groupsScreen: {
    containerBg: '#F0F4FF',
    headerBg: '#F0F4FF',
    headerTitle: '#0B3D91',
    headerIcon: '#A0B4FF',

    centerBg: '#F0F4FF',
    activityIndicator: '#A0B4FF',
    errorText: '#C00',

    listBg: 'transparent',
    emptyListText: '#0B3D91',

    groupCardBg: '#DEE4FF',
    groupCardShadowColor: '#000',
    groupNameText: '#0B3D91',
    groupIconColor: '#0B3D91',

    lockIconBgLocked: '#EEA6A6',
    lockIconBgUnlocked: '#EFF2FF',
    lockIconBorderLocked: '#C00',
    lockIconBorderUnlocked: '#A0B4FF',
    lockIconColorLocked: '#C00',
    lockIconColorUnlocked: '#A0B4FF',

    addMainButtonBg: '#A0B4FF',
    addButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#EFF2FF',
    inputBg: '#FFFFFF',
    inputBorder: '#C0C4E8',
    modalButtonBg: '#D0DAFF',
    modalCancelButtonBg: '#FFD0D7',
    modalText: '#0B3D91',
    modalCancelText: '#C00',
  } as GroupsScreenColors,


deviceSettings: {
    containerBg: '#F0F4FF',
    headerBg: '#F0F4FF',
    headerTitle: '#0B3D91',
    headerIcon: '#A0B4FF',

    centerBg: '#F0F4FF',
    activityIndicator: '#A0B4FF',
    errorText: '#C00',

    cardBg: '#EFF2FF',
    cardShadowColor: '#000',
    cardTitleText: '#0B3D91',
    emptyText: '#0B3D91',

    eventBorderColor: '#D0DAFF',
    eventDateText: '#0B3D91',
    eventStatusNotifiedText: '#C00',
    eventStatusRegisteredText: '#0B3D91',
    eventIconNotified: '#C00',
    eventIconRegistered: '#A0B4FF',

    footerBg: '#F0F4FF',
    primaryButtonBg: '#A0B4FF',
    primaryButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.5)',
    modalContentBg: '#FFFFFF',
    modalTitleText: '#0B3D91',
    modalInputBg: '#FFFFFF',
    modalInputBorder: '#D0DAFF',
    modalButtonBg: '#D0DAFF',
    modalCancelButtonBg: '#FFD0D7',
    modalText: '#0B3D91',
    modalCancelText: '#C00',
    modalSaveText: '#0B3D91',
  } as DeviceSettingsColors,


  groupDetail: {
    containerBg: '#F0F4FF',
    headerBg: '#F0F4FF',
    headerTitle: '#0B3D91',
    headerIcon: '#A0B4FF',

    centerBg: '#F0F4FF',
    activityIndicator: '#A0B4FF',
    errorText: '#C00',

    cardBg: '#EFF2FF',
    cardShadowColor: '#000',
    cardTitleText: '#0B3D91',
    statusText: '#0B3D91',

    buttonPrimaryBg: '#A0B4FF',
    buttonPrimaryText: '#FFFFFF',
    buttonDisabledBg: '#E0E2F0',

    iconButtonBgDefault: '#E5EAFF',
    iconButtonBorderDefault: '#A0B4FF',
    iconButtonBgLocked: 'rgba(192,0,0,0.1)',
    iconButtonBorderLocked: '#C00',
    iconButtonBgDelete: 'rgba(192, 0, 0, 0.1)',
    iconButtonBorderDelete: '#C00',
    iconButtonColorLocked: '#C00',
    iconButtonColorUnlocked: '#A0B4FF',
    iconButtonColorDelete: '#C00',

    groupNameText: '#0B3D91',
    deviceNameText: '#0B3D91',
    deviceSerialText: '#0B3D91',

    separatorColor: '#C0C4E8',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#EFF2FF',
    modalText: '#0B3D91',
    modalButtonBg: '#D0DAFF',

    renameModalContentBg: '#EFF2FF',
    modalTitleText: '#0B3D91',
    modalInputBg: '#FFFFFF',
    modalInputBorder: '#C0C4E8',
    modalCancelText: '#A0B4FF',
    modalSaveText: '#0B3D91',
    
    emptyText: '#0B3D91',
    eventIconRegistered: '#A0B4FF',
    buttonDisabledText: '#B0B0B0', // texto gris suave en claro

  } as GroupDetailColors,

  welcomeHelp: {
    containerBg: '#F0F4FF',
    titleText: '#0B3D91',
    subtitleText: '#0B3D91',

    cardBg: '#EFF2FF',
    cardShadowColor: '#000',
    featureTitleText: '#0B3D91',
    featureDescText: '#0B3D91',
    bulletColor: '#A0B4FF',
    bulletText: '#0B3D91',

    dotActive: '#A0B4FF',
    dotInactive: '#C0C4E8',

    buttonBg: '#A0B4FF',
    buttonText: '#FFFFFF',
  } as WelcomeHelpColors,

};

export const darkColors = {
  // Pantalla de Login
  loginScreen: {
    containerBg: '#1F1729',        // fondo general muy oscuro con matiz púrpura
    cardBg: '#2A1F3A',             // tarjeta intermedia más clara pero aún púrpura-oscuro
    inputBg: '#3A2E4E',            // inputs con púrpura aún más “subido”
    inputBorder: '#4A2E5A',        // borde ligeramente más claro que el fondo de input
    passwordWrapperBg: '#3A2E4E',  // mismo fondo que un input, para coherencia
    buttonPrimaryBg: '#4F6ECD',    // azul-pastel para botón principal (coordinado con HomeScreen)
    buttonPrimaryText: '#FFFFFF',  // texto blanco sobre el botón
    buttonSecondaryBorder: '#4F6ECD', // borde del botón secundario
    buttonSecondaryText: '#4F6ECD', // texto secundario en azul-pastel
    textDefault: '#E0E0E0',         // texto general en gris claro
    activityIndicator: '#4F6ECD',   // spinner también en azul-pastel
    eyeColor: '#A495D6',            // púpura claro para icono “ojo”
  } as LoginScreenColors,

  // Pantalla de Ajustes Generales
  settingsGeneral: {
    containerBg: '#1F1729',        // mismo fondo base que login
    headerBg: '#1F1729',           // cabecera idéntica al contenedor
    headerText: '#E0E0E0',         // texto del header en gris claro
    iconTint: '#A495D6',           // íconos en púrpura-claro
    sectionTitle: '#E0E0E0',       // títulos de sección en gris claro
    subheading: '#E0E0E0',         // **NUEVO** subtítulos en el mismo gris claro
    bullet: '#B3A0D1',             // **NUEVO** texto de viñetas (púrpura suave)
    cardBg: '#2A2233',             // fondo de cada tarjeta un poco más claro
    rowText: '#E0E0E0',            // texto de filas en gris claro
    separator: '#3A2E4E',          // línea divisoria en un púrpura intermedio
    modalOverlayBg: 'rgba(0,0,0,0.6)', // superposición semitransparente
    modalContainerBg: '#2A2233',   // fondo del modal igual que cardBg
    modalTitle: '#E0E0E0',         // título del modal en gris claro
    modalOptionText: '#E0E0E0',    // opciones del modal en gris claro
    modalCancelText: '#4F6ECD',    // botón de cancelar en azul-pastel
  } as SettingsGeneralColors,

  // Pantalla de Registro
  registerScreen: {
    containerBg: '#1F1729',        // fondo base igual que login y settings
    cardBg: '#2A2233',             // tarjeta clara en púrpura oscuro
    titleText: '#E0E0E0',          // título en gris claro
    inputBg: '#3A2E4E',            // fondo de cada TextInput en púrpura
    inputBorder: '#4A2E5A',        // borde de input levemente más claro
    inputPlaceholder: '#A495D6',   // placeholder en púrpura-claro
    inputErrorBorder: '#E57373',   // borde de error en rosa pálido
    passwordWrapperBg: '#3A2E4E',  // mismo fondo que input
    buttonPrimaryBg: '#4F6ECD',    // botón principal en azul-pastel
    buttonPrimaryText: '#FFFFFF',  // texto blanco
    linkText: '#A495D6',           // enlace “¿Ya tienes cuenta?” en púrpura-claro
    eyeColor: '#A495D6',           // icono de ojo en púrpura-claro
    activityIndicator: '#4F6ECD',  // spinner en azul-pastel
    errorText: '#E57373',          // texto de error en rosa pálido
  } as RegisterScreenColors,

  // Pantalla Home
  homeScreen: {
    // Fondo principal: gradiente (tonos oscuros/púrpura pastel)
    gradientStart: '#1F1729',
    gradientEnd:   '#2A1F3A',

    // Header (íconos del menú y notificaciones)
    headerIcon: '#A495D6',
    headerIcon1: '#1F1729',
    headerIcon2: '#A495D6',

    // Modal de categorías
    modalOverlayBg:   'rgba(0, 0, 0, 0.5)',
    modalContentBg:   '#2A2233',
    modalButtonBg:    '#3A2E4E',
    modalText:        '#E0E0E0',

    // Selector “estrella” / “recuadro”
    selectorContainerBg:  '#3A2E4E',
    selectorButtonBg:     '#2A2233',
    selectorButtonActiveBg: '#4F6ECD',
    selectorIconActive:   '#1F1729',
    selectorIconInactive: '#A495D6',

    // Lista de favoritos (modo lista)
    favListCardBg:        '#3A2E4E',
    favListText:          '#E0E0E0',
    favListStatusActive:  '#F48FB1',
    favListStatusInactive:'#E0E0E0',
    emptyCardBorder:      '#3A2E4E',
    emptyCardBg:          'transparent',
    deleteActionBg:       '#E57373',

    // IconWrapper (candado en lista)
    iconWrapperBorderActive:   '#F48FB1',
    iconWrapperBorderInactive: '#A495D6',
    iconWrapperBgActive:       '#5A3A4A',
    iconWrapperBgInactive:     '#2A2233',

    // Círculo principal (modo estrella)
    lockCircleBorderActive:   '#F48FB1',
    lockCircleBorderInactive: '#A495D6',
    lockCircleBgGradientStart:'#1F1729',
    lockCircleBgGradientEnd:  '#2A1F3A',
    noMainText:               '#E0E0E0',

    // Tarjeta principal (info del favorito principal)
    mainCardBg:      '#2A1F3A',
    mainTitle:       '#E0E0E0',
    mainSubtitle:    '#E0E0E0',

    // Botones del drawer
    drawerBg:        '#1F1729',
    handleBg:        '#3A2E4E',
    drawerItemBg:    '#2A2233',
    drawerLabel:     '#E0E0E0',

    // Colores comunes
    activityIndicator: '#4F6ECD',
    errorText:        '#FF6161',
  } as HomeScreenColors,

    deviceSelector: {
    containerBg: '#1F1729',      // fondo general oscuro
    centerText: '#E0E0E0',       // texto centrado (ActivityIndicator vacío)
    listBg: 'transparent',
    rowBg: '#3A2E4E',            // tarjeta de cada fila en púrpura oscuro
    rowShadowColor: '#000',
    iconContainerBg: '#2A2233',  // fondo del icono en púrpura intermedio
    iconColor: '#A495D6',
    nameText: '#E0E0E0',
    subText: '#E0E0E0',
    emptyText: '#E0E0E0',
    backBg: '#4F6ECD',           // botón “Atrás” en azul-pastel
    backText: '#FFFFFF',
    activityIndicator: '#4F6ECD',// spinner en azul-pastel
  } as DeviceSelectorColors,


  groupSelector: {
    containerBg: '#1F1729',       // fondo general oscuro
    centerText: '#E0E0E0',        // texto del ActivityIndicator
    listBg: 'transparent',
    rowBg: '#3A2E4E',             // fila en púrpura oscuro
    rowShadowColor: '#000',
    iconContainerBg: '#2A2233',   // fondo del ícono en púrpura intermedio
    iconColor: '#A495D6',         // color del GroupIcon
    nameText: '#E0E0E0',          // texto del nombre
    subText: '#E0E0E0',           // texto del estado (“Bloqueado”/“Desbloqueado”)
    emptyText: '#E0E0E0',         // texto cuando la lista está vacía
    backBg: '#4F6ECD',            // botón “Atrás” en azul-pastel
    backText: '#FFFFFF',
    activityIndicator: '#4F6ECD', // spinner en azul-pastel
  } as GroupSelectorColors,

  devicesScreen: {
    containerBg: '#1F1729',
    headerBg: '#1F1729',
    headerTitle: '#E0E0E0',
    headerIcon: '#A495D6',

  iconButtonActiveBorder: '#F48FB1',
  iconButtonBorder: '#A495D6',

    centerBg: '#1F1729',
    activityIndicator: '#4F6ECD',
    errorText: '#FF6161',

    listBg: 'transparent',
    emptyListText: '#E0E0E0',

    deviceCardBg: '#3A2E4E',
    deviceCardShadowColor: '#000',
    deviceName: '#E0E0E0',
    deviceStatus: '#E0E0E0',

    iconButtonBg: '#2A2233',
    iconButtonActiveBg: '#5A3A4A',

    addMainButtonBg: '#4F6ECD',
    addButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#2A2233',
    inputBg: '#323235',
    inputBorder: '#4A4A4F',
    modalButtonBg: '#3A2E4E',
    modalCancelButtonBg: '#5A3A4A',
    modalText: '#E0E0E0',
    modalCancelText: '#F48FB1',
  } as DevicesScreenColors,



  groupsScreen: {
    containerBg: '#1F1729',
    headerBg: '#1F1729',
    headerTitle: '#E0E0E0',
    headerIcon: '#A495D6',

    centerBg: '#1F1729',
    activityIndicator: '#4F6ECD',
    errorText: '#FF6161',

    listBg: 'transparent',
    emptyListText: '#E0E0E0',

    groupCardBg: '#3A2E4E',
    groupCardShadowColor: '#000',
    groupNameText: '#E0E0E0',
    groupIconColor: '#E0E0E0',

    lockIconBgLocked: '#5A3A4A',
    lockIconBgUnlocked: '#2A2233',
    lockIconBorderLocked: '#F48FB1',
    lockIconBorderUnlocked: '#A495D6',
    lockIconColorLocked: '#F48FB1',
    lockIconColorUnlocked: '#A495D6',

    addMainButtonBg: '#4F6ECD',
    addButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#2A2233',
    inputBg: '#323235',
    inputBorder: '#4A4A4F',
    modalButtonBg: '#3A2E4E',
    modalCancelButtonBg: '#5A3A4A',
    modalText: '#E0E0E0',
    modalCancelText: '#F48FB1',
  } as GroupsScreenColors,

deviceSettings: {
    containerBg: '#1F1729',
    headerBg: '#1F1729',
    headerTitle: '#E0E0E0',
    headerIcon: '#A495D6',

    centerBg: '#1F1729',
    activityIndicator: '#4F6ECD',
    errorText: '#FF6161',

    cardBg: '#2A2233',
    cardShadowColor: '#000',
    cardTitleText: '#E0E0E0',
    emptyText: '#E0E0E0',

    eventBorderColor: '#3A2E4E',
    eventDateText: '#E0E0E0',
    eventStatusNotifiedText: '#FF6161',
    eventStatusRegisteredText: '#E0E0E0',
    eventIconNotified: '#FF6161',
    eventIconRegistered: '#A495D6',

    footerBg: '#1F1729',
    primaryButtonBg: '#4F6ECD',
    primaryButtonText: '#FFFFFF',

    modalOverlayBg: 'rgba(0,0,0,0.5)',
    modalContentBg: '#2A2233',
    modalTitleText: '#E0E0E0',
    modalInputBg: '#323235',
    modalInputBorder: '#4A4A4F',
    modalButtonBg: '#3A2E4E',
    modalCancelButtonBg: '#5A3A4A',
    modalText: '#E0E0E0',
    modalCancelText: '#FF6161',
    modalSaveText: '#E0E0E0',
  } as DeviceSettingsColors,

groupDetail: {
    containerBg: '#1F1729',
    headerBg: '#1F1729',
    headerTitle: '#E0E0E0',
    headerIcon: '#A495D6',

    centerBg: '#1F1729',
    activityIndicator: '#4F6ECD',
    errorText: '#FF6161',

    cardBg: '#2A2233',
    cardShadowColor: '#000',
    cardTitleText: '#E0E0E0',
    statusText: '#E0E0E0',

    buttonPrimaryBg: '#4F6ECD',
    buttonPrimaryText: '#FFFFFF',
    buttonDisabledBg: '#30253D',

    iconButtonBgDefault: '#2A2233',
    iconButtonBorderDefault: '#A495D6',
    iconButtonBgLocked: '#5A3A4A',
    iconButtonBorderLocked: '#F48FB1',
    iconButtonBgDelete: '#5A3A4A',
    iconButtonBorderDelete: '#FF5252',
    iconButtonColorLocked: '#F48FB1',
    iconButtonColorUnlocked: '#A495D6',
    iconButtonColorDelete: '#FF5252',

    groupNameText: '#E0E0E0',
    deviceNameText: '#E0E0E0',
    deviceSerialText: '#E0E0E0',

    separatorColor: '#3A2E4E',

    modalOverlayBg: 'rgba(0,0,0,0.3)',
    modalContentBg: '#2A2233',
    modalText: '#E0E0E0',
    modalButtonBg: '#3A2E4E',

    renameModalContentBg: '#2A2233',
    modalTitleText: '#E0E0E0',
    modalInputBg: '#323235',
    modalInputBorder: '#4A4A4F',
    modalCancelText: '#FF6161',
    modalSaveText: '#E0E0E0',
    
    emptyText: '#E0E0E0',
    eventIconRegistered: '#A495D6',
    buttonDisabledText: '#3F3B43', // texto gris en oscuro

  } as GroupDetailColors,

  welcomeHelp: {
    containerBg: '#1F1729',
    titleText: '#E0E0E0',
    subtitleText: '#E0E0E0',

    cardBg: '#2A2233',
    cardShadowColor: '#000',
    featureTitleText: '#E0E0E0',
    featureDescText: '#E0E0E0',
    bulletColor: '#A495D6',
    bulletText: '#E0E0E0',

    dotActive: '#4F6ECD',
    dotInactive: '#3A2E4E',

    buttonBg: '#4F6ECD',
    buttonText: '#FFFFFF',
  } as WelcomeHelpColors,
};
