import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { PlayArrow, Refresh } from '@mui/icons-material';
import PatientCard from '../components/PatientCard';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workflowResult, setWorkflowResult] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchLogs();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data.patients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await apiService.getDischargeLog();
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const runDischargeDetection = async () => {
    setLoading(true);
    try {
      const response = await apiService.runDischargeDetection();
      setWorkflowResult(response.data);
      await fetchPatients(); // Refresh patient data
      await fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Error running discharge detection:', error);
      setWorkflowResult({ error: error.response?.data?.detail || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const readyCount = patients.filter(p => p.ready_for_discharge).length;
  const totalCount = patients.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🏥 MediFlow AI - Discharge Management
      </Typography>
      
      {/* Control Panel */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Discharge Readiness Detection</Typography>
            <Typography variant="body2" color="textSecondary">
              AI agent monitors patients and detects discharge readiness
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                onClick={runDischargeDetection}
                disabled={loading}
              >
                {loading ? 'Running AI Agent...' : 'Run Discharge Detection'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchPatients}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Workflow Result */}
      {workflowResult && (
        <Alert 
          severity={workflowResult.error ? 'error' : 'success'} 
          sx={{ mb: 3 }}
          onClose={() => setWorkflowResult(null)}
        >
          {workflowResult.error ? (
            `Error: ${workflowResult.error}`
          ) : (
            `✅ Processed ${workflowResult.processed_count} patients. ${workflowResult.ready_patients.length} marked as ready for discharge.`
          )}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">{totalCount}</Typography>
            <Typography variant="subtitle1">Total Patients</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">{readyCount}</Typography>
            <Typography variant="subtitle1">Ready for Discharge</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">{totalCount - readyCount}</Typography>
            <Typography variant="subtitle1">In Treatment</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Patient List */}
      <Typography variant="h5" component="h2" gutterBottom>
        Patient List
      </Typography>
      {patients.map((patient) => (
        <PatientCard key={patient.patient_id} patient={patient} />
      ))}

      {/* Recent Activity */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        {logs.slice(0, 5).map((log, index) => (
          <Box key={index} sx={{ mb: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>{log.agent}:</strong> {log.details}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Patient: {log.patient_id} | {new Date(log.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Dashboard;
