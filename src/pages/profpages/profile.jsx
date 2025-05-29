import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  TextField,
  useTheme,
  FormControl,
  FormLabel,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AddCircle, RemoveCircle, Edit, Save, Lock, Mail, Phone } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [services, setServices] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [deactivationDialog, setDeactivationDialog] = useState(false);
  const [deactivationPassword, setDeactivationPassword] = useState('');
const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    photo: 'default.png',
    isActive: true,
    specialite: '',
  });

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setSnackbar({ open: true, message: 'Veuillez vous reconnecter', severity: 'error' });
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const userResponse = await axios.get(`https://deploy-back-3.onrender.com/api/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const professionalResponse = await axios.get(`https://deploy-back-3.onrender.com/api/professionals/${userId}`);
        
        setProfileData({
          ...userResponse.data,
          specialite: professionalResponse.data?.specialite || '',
          photo: userResponse.data.photo 
            ? `https://deploy-back-3.onrender.com/uploads/${userResponse.data.photo}`
            : 'default.png',
        });
        
        setServices(professionalResponse.data?.services || []);
      } catch (error) {
        console.error('Fetch error:', error);
        setSnackbar({ open: true, message: 'Erreur de chargement', severity: 'error' });
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) handleSaveProfile();
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://deploy-back-3.onrender.com/api/user/profile/${userId}`,
        { ...profileData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: 'Profil sauvegardé', severity: 'success' });
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({ open: true, message: 'Erreur de sauvegarde', severity: 'error' });
    }
  };

  // Gestion des services
  const handleServiceChange = (index, value) => {
    const newServices = [...services];
    newServices[index] = value;
    setServices(newServices);
  };

  const addService = () => setServices([...services, '']);
  const removeService = index => setServices(services.filter((_, i) => i !== index));

  const saveServices = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://deploy-back-3.onrender.com/api/professionals/${userId}/services`,
        { services },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: 'Services sauvegardés', severity: 'success' });
    } catch (error) {
      console.error('Service save error:', error);
      setSnackbar({ open: true, message: 'Erreur de sauvegarde', severity: 'error' });
    }
  };

  // Gestion de la photo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://deploy-back-3.onrender.com/api/user/profile/${userId}/photo`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData({ ...profileData, photo: `https://deploy-back-3.onrender.com/uploads/${response.data.photo}` });
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  };

  // Gestion du mot de passe
  const handlePasswordChange = async () => {
    if (profileData.newPassword !== profileData.confirmPassword) {
      setSnackbar({ open: true, message: 'Les mots de passe ne correspondent pas', severity: 'error' });
      return;
    }

    try {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem('token');
      
      await axios.put(
        `https://deploy-back-3.onrender.com/api/user/profile/${userId}/password`,
        {
          oldPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
          confirmPassword: profileData.confirmPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: 'Mot de passe mis à jour', severity: 'success' });
      setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      setSnackbar({ open: true, message: error.response?.data?.message || 'Erreur de modification', severity: 'error' });
    }
  };

  // Gestion activation/désactivation
  const handleAccountStatus = async (activate = false) => {
  try {
    const userId = getUserIdFromToken();
    const token = localStorage.getItem('token');
    
    const endpoint = activate 
      ? `activate` 
      : `deactivate`;

    await axios.put(
      `https://deploy-back-3.onrender.com/api/user/profile/${userId}/${endpoint}`,
      { password: deactivationPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setProfileData({ ...profileData, isActive: activate });
    setDeactivationDialog(false);
    setDeactivationPassword('');

    if (!activate) {
      // Afficher la boîte de dialogue de confirmation finale
      setConfirmationDialog(true);
    } else {
      setSnackbar({
        open: true,
        message: 'Compte activé avec succès',
        severity: 'success'
      });
    }

  } catch (error) {
    console.error('Status change error:', error);
    setSnackbar({ 
      open: true, 
      message: error.response?.data?.message || 'Erreur de modification', 
      severity: 'error' 
    });
  }
};

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'background.default' }}>
      <Box sx={{ maxWidth: 'xl', mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Mon Profil</Typography>
          <Button
            variant="contained"
            startIcon={isEditing ? <Save /> : <Edit />}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Sauvegarder' : 'Modifier'}
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {/* Colonne gauche */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Box sx={{ position: 'relative', textAlign: 'center' }}>
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Edit />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={handleFileChange}
                  />
                  <Avatar
                    src={profileData.photo}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6">{profileData.nom}</Typography>
                  <Typography color="text.secondary">{profileData.specialite}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Mail sx={{ mr: 1 }} />
                    <Typography>{profileData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1 }} />
                    <Typography>{profileData.telephone || 'Non renseigné'}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Colonne droite */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Informations personnelles
                </Typography>

                <Grid container spacing={3}>
                  {/* Champs standards */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nom complet"
                      fullWidth
                      value={profileData.nom}
                      onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={profileData.email}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Téléphone"
                      fullWidth
                      value={profileData.telephone}
                      onChange={(e) => setProfileData({ ...profileData, telephone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date de naissance"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={profileData.dateNaissance?.split('T')[0] || ''}
                      onChange={(e) => setProfileData({ ...profileData, dateNaissance: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Adresse"
                      fullWidth
                      value={profileData.adresse}
                      onChange={(e) => setProfileData({ ...profileData, adresse: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>

                  {/* Modification du mot de passe */}
                  {isEditing && (
                    <>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Modification du mot de passe
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Mot de passe actuel"
                          type="password"
                          fullWidth
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Nouveau mot de passe"
                          type="password"
                          fullWidth
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Confirmation"
                          type="password"
                          fullWidth
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          onClick={handlePasswordChange}
                          sx={{ mt: 2 }}
                        >
                          Modifier le mot de passe
                        </Button>
                      </Grid>
                    </>
                  )}

                  {/* Services professionnels */}
                  {profileData.role === 'professional' && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Services proposés
                      </Typography>
                      
                      {services.map((service, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <TextField
                            fullWidth
                            value={service}
                            onChange={(e) => handleServiceChange(index, e.target.value)}
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <IconButton 
                              onClick={() => removeService(index)}
                              color="error"
                            >
                              <RemoveCircle />
                            </IconButton>
                          )}
                        </Box>
                      ))}

                      {isEditing && (
                        <Button
                          startIcon={<AddCircle />}
                          onClick={addService}
                          sx={{ mt: 1 }}
                        >
                          Ajouter un service
                        </Button>
                      )}

                      {isEditing && services.length > 0 && (
                        <Button
                          variant="contained"
                          onClick={saveServices}
                          sx={{ mt: 2, float: 'right' }}
                        >
                          Sauvegarder les services
                        </Button>
                      )}
                    </Grid>
                  )}

                  {/* Activation/Désactivation du compte */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    {profileData.isActive ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setDeactivationDialog(true)}
                      >
                        Désactiver le compte
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="success"
                        onClick={() => handleAccountStatus(true)}
                      >
                        Activer le compte
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog de confirmation pour la désactivation */}
<Dialog open={deactivationDialog} onClose={() => setDeactivationDialog(false)}>
  <DialogTitle>Confirmer la désactivation</DialogTitle>
  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Mot de passe actuel"
      type="password"
      fullWidth
      value={deactivationPassword}
      onChange={(e) => setDeactivationPassword(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeactivationDialog(false)}>Annuler</Button>
    <Button 
      onClick={() => {
        setDeactivationDialog(false);
        setConfirmationDialog(true); // Ouvrir la confirmation finale
      }}
      color="error"
    >
      Confirmer
    </Button>
  </DialogActions>
</Dialog>

{/* Dialogue de confirmation finale */}
<Dialog open={confirmationDialog} onClose={() => setConfirmationDialog(false)}>
  <DialogTitle>Confirmation finale</DialogTitle>
  <DialogContent>
    <Typography gutterBottom>
      Êtes-vous sûr de vouloir désactiver votre compte ? Vous aurez 2 mois pour le réactiver.
    </Typography>
    <Typography>Cette action est irréversible pendant cette période.</Typography>
  </DialogContent>
  <DialogActions>
    <Button 
      onClick={() => {
        setConfirmationDialog(false);
        setDeactivationPassword(''); // Réinitialiser le mot de passe
      }}
      color="primary"
    >
      Non, annuler
    </Button>
    <Button 
      onClick={async () => {
        try {
          const userId = getUserIdFromToken();
          const token = localStorage.getItem('token');
          
          await axios.put(
            `https://deploy-back-3.onrender.com/api/user/profile/${userId}/deactivate`,
            { password: deactivationPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setProfileData({ ...profileData, isActive: false });
          setSnackbar({
            open: true,
            message: 'Compte désactivé avec succès',
            severity: 'success'
          });
          
          // Demander la déconnexion
          localStorage.removeItem('token');
          navigate('/login');

        } catch (error) {
          console.error('Erreur de désactivation :', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Échec de la désactivation',
            severity: 'error'
          });
        }
        setConfirmationDialog(false);
      }}
      color="error"
    >
      Oui, désactiver
    </Button>
  </DialogActions>
</Dialog>

        {/* Snackbar de notification */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            onClose={handleSnackbarClose}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProfilePage;