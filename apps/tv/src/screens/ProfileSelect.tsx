// SmartStudy TV — Profile Select Screen
// Shows all registered children as large avatar tiles + Add Kid option.
// Parents can also log in, register, and manage family profiles.

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FocusTile } from '../components/FocusTile';
import { TVScrollView } from '../components/TVScrollView';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { api, Child, UserAccount } from '../hooks/useAPI';
import { useOfflineCache } from '../hooks/useOfflineCache';

// Child emoji avatars — assigned by index for visual variety
const AVATARS = ['🦁', '🦋', '🚀', '🐼', '🦊', '🦄', '🐘', '🐬'];
const BG_COLORS = [
  ['#2D1B69', '#4C1D95'],
  ['#1A3A5C', '#1E40AF'],
  ['#1A3A2A', '#065F46'],
  ['#3D1A1A', '#7F1D1D'],
];

const PRESET_NAMES = ['Advait', 'Sara', 'Kabir', 'Vihaan', 'Aanya', 'Mira', 'Reyansh', 'Anvi'];
const GRADES = ['Pre-K', '1', '2', '3', '4', '5'];
const BOARDS = ['CBSE', 'ICSE', 'State Board'];

interface ProfileSelectProps {
  onSelect: (child: Child) => void;
}

export function ProfileSelect({ onSelect }: ProfileSelectProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Modals state
  const [showAddKidModal, setShowAddKidModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // New kid form state
  const [selectedPresetNameIdx, setSelectedPresetNameIdx] = useState(0);
  const [customName, setCustomName] = useState('');
  const [selectedGradeIdx, setSelectedGradeIdx] = useState(1); // Class 1
  const [selectedBoardIdx, setSelectedBoardIdx] = useState(0); // CBSE
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);

  // Parent Auth form state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const { fetchWithCache } = useOfflineCache();

  const loadData = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      const data = await api.getChildren();
      setChildren(data);
      setLoading(false);
    } catch {
      setError('Cannot connect to server. Please check your network.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Register main focus grid
  useEffect(() => {
    if (loading || showAddKidModal || showAuthModal) return;

    const childKeys = children.map((_, i) => `child-${i}`);
    childKeys.push('btn-add-kid');

    const topActionKey = currentUser ? 'btn-parent-logout' : 'btn-parent-auth';

    tvFocusManager.register(
      {
        type: 'grid',
        grid: [
          [topActionKey, topActionKey],
          childKeys,
        ],
      },
      childKeys[0] || 'btn-add-kid',
    );
  }, [children, loading, currentUser, showAddKidModal, showAuthModal]);

  // Focus registration when Add Kid modal is open
  useEffect(() => {
    if (!showAddKidModal) return;
    tvFocusManager.register(
      {
        type: 'grid',
        grid: [
          ['btn-cycle-name', 'btn-cycle-grade'],
          ['btn-cycle-board', 'btn-cycle-avatar'],
          ['btn-save-kid', 'btn-cancel-kid'],
        ],
      },
      'btn-cycle-name',
    );
  }, [showAddKidModal]);

  // Focus registration when Auth modal is open
  useEffect(() => {
    if (!showAuthModal) return;
    const gridRows = [
      ['btn-auth-toggle-mode'],
      ['btn-auth-demo'],
      ['btn-auth-submit', 'btn-auth-cancel'],
    ];
    tvFocusManager.register(
      {
        type: 'grid',
        grid: gridRows,
      },
      'btn-auth-submit',
    );
  }, [showAuthModal, authMode]);

  const handleSaveKid = async () => {
    const finalName = customName.trim() || PRESET_NAMES[selectedPresetNameIdx];
    const grade = GRADES[selectedGradeIdx];
    const board = BOARDS[selectedBoardIdx];
    const avatar = AVATARS[selectedAvatarIdx];

    try {
      const created = await api.createChild({
        name: finalName,
        grade,
        board,
        medium: 'English',
        parentId: currentUser?.id,
        avatar,
      });

      setShowAddKidModal(false);
      setCustomName('');
      const updated = await api.getChildren();
      setChildren(updated);
      setTimeout(() => tvFocusManager.setFocused('child-0'), 150);
    } catch {
      setShowAddKidModal(false);
    }
  };

  const handleParentAuthSubmit = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'register') {
        const nameToUse = authName.trim() || 'Parent User';
        const emailToUse = authEmail.trim() || `parent_${Date.now()}@smartstudy.ai`;
        const passToUse = authPassword.trim() || 'password123';
        const res = await api.register(nameToUse, emailToUse, passToUse);
        setCurrentUser(res.user);
      } else {
        const emailToUse = authEmail.trim() || 'parent@smartstudy.ai';
        const passToUse = authPassword.trim() || 'password123';
        const res = await api.login(emailToUse, passToUse);
        setCurrentUser(res.user);
      }
      setShowAuthModal(false);
      setAuthLoading(false);
      loadData();
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
      setAuthLoading(false);
    }
  };

  const handleParentLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.focus} />
        <Text style={[typography.body, { marginTop: spacing.md }]}>Loading profiles…</Text>
      </View>
    );
  }

  if (error && children.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={[typography.heading, { color: colors.wrong }]}>😕</Text>
        <Text style={[typography.body, { marginTop: spacing.md, textAlign: 'center' }]}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Floating star particles */}
      <View style={styles.particles} pointerEvents="none">
        {Array.from({ length: 30 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${(i * 37) % 100}%` as any,
                top: `${(i * 53) % 100}%` as any,
                width: i % 3 === 0 ? 6 : 3,
                height: i % 3 === 0 ? 6 : 3,
                opacity: 0.2 + (i % 5) * 0.1,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.inner}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={typography.display}>📺 SmartStudy AI</Text>
            <Text style={[typography.muted, { marginTop: 2 }]}>
              {currentUser ? `Family of ${currentUser.name} 🏡` : 'Who is studying today?'}
            </Text>
          </View>

          {/* Parent Auth / Logout Buttons */}
          <View style={styles.authRow}>
            {currentUser ? (
              <FocusTile
                focusKey="btn-parent-logout"
                onPress={handleParentLogout}
                style={styles.authBtn}
              >
                <Text style={[typography.caption, { color: colors.textMuted, fontWeight: '700' }]}>
                  🚪 Sign Out ({currentUser.name})
                </Text>
              </FocusTile>
            ) : (
              <FocusTile
                focusKey="btn-parent-auth"
                onPress={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setShowAuthModal(true);
                }}
                style={styles.authBtn}
              >
                <Text style={[typography.caption, { color: colors.focusBorder, fontWeight: '700' }]}>
                  🔑 Parent Login / Register
                </Text>
              </FocusTile>
            )}
          </View>
        </View>

        {/* Profile cards + Add Kid Card */}
        <TVScrollView
          horizontal
          style={styles.scroll}
          contentContainerStyle={styles.grid}
          showsHorizontalScrollIndicator={false}
        >
          {children.map((child, i) => {
            const avatar = child.avatar || AVATARS[i % AVATARS.length];
            const [c1, c2] = BG_COLORS[i % BG_COLORS.length];
            return (
              <FocusTile
                key={child.id}
                focusKey={`child-${i}`}
                onPress={() => onSelect(child)}
                style={[styles.card, { backgroundColor: c1 }]}
              >
                <View style={[styles.cardGradient, { backgroundColor: c2 + '88' }]} />
                <Text style={styles.avatar}>{avatar}</Text>
                <Text style={[typography.heading, styles.childName]} numberOfLines={1}>
                  {child.name}
                </Text>
                <Text style={[typography.caption, { textAlign: 'center', color: colors.textDim }]}>
                  Grade {child.grade} • {child.board}
                </Text>
              </FocusTile>
            );
          })}

          {/* Add Kid Card (Parents only after login) */}
          <FocusTile
            focusKey="btn-add-kid"
            onPress={() => {
              if (!currentUser) {
                setAuthMode('login');
                setAuthError('🔒 Parent Login Required: Please sign in or register as a parent to create student profiles.');
                setShowAuthModal(true);
                return;
              }
              setShowAddKidModal(true);
            }}
            style={[styles.card, styles.addCard]}
          >
            <Text style={styles.addIcon}>➕</Text>
            <Text style={[typography.heading, { color: colors.gold, marginTop: 4 }]}>
              Add Kid
            </Text>
            <Text style={[typography.tiny, { color: colors.textMuted, textAlign: 'center' }]}>
              {currentUser ? 'Create student profile' : 'Sign in as Parent to add'}
            </Text>
          </FocusTile>
        </TVScrollView>

        <Text style={[typography.caption, styles.hint]}>
          Use ← → to select profile • Press OK to begin • Press ↑ for Parent Account
        </Text>
      </View>

      {/* ── MODAL: ADD STUDENT PROFILE ── */}
      {showAddKidModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[typography.heading, { color: colors.gold, textAlign: 'center' }]}>
              ✨ Add Student Profile
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.md }]}>
              Parents can add multiple children profiles to SmartStudy TV
            </Text>

            {/* Quick interactive selectors tailored for TV Remote */}
            <View style={styles.pickerRow}>
              {/* Name Picker */}
              <FocusTile
                focusKey="btn-cycle-name"
                onPress={() => setSelectedPresetNameIdx(idx => (idx + 1) % PRESET_NAMES.length)}
                style={[styles.fieldTile, styles.pickerTile]}
              >
                <Text style={styles.fieldLabel}>Child Name (Press OK to change)</Text>
                <Text style={styles.fieldValue}>{PRESET_NAMES[selectedPresetNameIdx]}</Text>
              </FocusTile>

              {/* Grade Picker */}
              <FocusTile
                focusKey="btn-cycle-grade"
                onPress={() => setSelectedGradeIdx(idx => (idx + 1) % GRADES.length)}
                style={[styles.fieldTile, styles.pickerTile]}
              >
                <Text style={styles.fieldLabel}>Grade (Press OK to change)</Text>
                <Text style={styles.fieldValue}>Class {GRADES[selectedGradeIdx]}</Text>
              </FocusTile>
            </View>

            <View style={styles.pickerRow}>
              {/* Board Picker */}
              <FocusTile
                focusKey="btn-cycle-board"
                onPress={() => setSelectedBoardIdx(idx => (idx + 1) % BOARDS.length)}
                style={[styles.fieldTile, styles.pickerTile]}
              >
                <Text style={styles.fieldLabel}>Board (Press OK to change)</Text>
                <Text style={styles.fieldValue}>{BOARDS[selectedBoardIdx]}</Text>
              </FocusTile>

              {/* Avatar Picker */}
              <FocusTile
                focusKey="btn-cycle-avatar"
                onPress={() => setSelectedAvatarIdx(idx => (idx + 1) % AVATARS.length)}
                style={[styles.fieldTile, styles.pickerTile]}
              >
                <Text style={styles.fieldLabel}>Avatar Emoji (Press OK)</Text>
                <Text style={[styles.fieldValue, { fontSize: 26 }]}>{AVATARS[selectedAvatarIdx]}</Text>
              </FocusTile>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <FocusTile
                focusKey="btn-save-kid"
                onPress={handleSaveKid}
                style={styles.saveBtn}
              >
                <Text style={[typography.body, { color: '#000', fontWeight: '700' }]}>
                  ✅ Save & Add Child
                </Text>
              </FocusTile>

              <FocusTile
                focusKey="btn-cancel-kid"
                onPress={() => setShowAddKidModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={[typography.body, { color: colors.textMuted }]}>
                  Cancel
                </Text>
              </FocusTile>
            </View>
          </View>
        </View>
      )}

      {/* ── MODAL: PARENT LOGIN & REGISTRATION ── */}
      {showAuthModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[typography.heading, { color: colors.gold, textAlign: 'center' }]}>
              {authMode === 'login' ? '👨‍👩‍👧 Parent Sign In' : '📝 Register Parent Account'}
            </Text>

            {authError && (
              <Text style={[typography.caption, { color: colors.wrong, textAlign: 'center', marginVertical: 4 }]}>
                {authError}
              </Text>
            )}

            <View style={{ gap: spacing.sm, marginVertical: spacing.md }}>
              <FocusTile
                focusKey="btn-auth-toggle-mode"
                onPress={() => {
                  setAuthMode(m => m === 'login' ? 'register' : 'login');
                  setAuthError(null);
                }}
                style={styles.fieldTile}
              >
                <Text style={styles.fieldLabel}>Mode (Press OK to switch)</Text>
                <Text style={styles.fieldValue}>
                  {authMode === 'login' ? '🔑 Sign In (Switch to Register)' : '📝 Register New Account (Switch to Sign In)'}
                </Text>
              </FocusTile>

              <FocusTile
                focusKey="btn-auth-demo"
                onPress={() => {
                  setAuthName('Priya Sharma');
                  setAuthEmail('parent@smartstudy.ai');
                  setAuthPassword('password123');
                }}
                style={[styles.fieldTile, { backgroundColor: 'rgba(255, 215, 0, 0.08)' }]}
              >
                <Text style={styles.fieldLabel}>Quick Fill (Press OK for Demo Account)</Text>
                <Text style={[styles.fieldValue, { color: colors.gold, fontSize: 13 }]}>
                  parent@smartstudy.ai / Priya Sharma
                </Text>
              </FocusTile>
            </View>

            <View style={styles.modalActions}>
              <FocusTile
                focusKey="btn-auth-submit"
                onPress={handleParentAuthSubmit}
                style={styles.saveBtn}
              >
                <Text style={[typography.body, { color: '#000', fontWeight: '700' }]}>
                  {authLoading ? 'Signing in…' : authMode === 'login' ? '🔑 Sign In' : '✨ Register Account'}
                </Text>
              </FocusTile>

              <FocusTile
                focusKey="btn-auth-cancel"
                onPress={() => setShowAuthModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={[typography.body, { color: colors.textMuted }]}>
                  Cancel
                </Text>
              </FocusTile>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  particles: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: colors.gold,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.safeH,
    paddingVertical: spacing.safeV,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.safeH,
    marginBottom: spacing.xs,
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  scroll: {
    flexGrow: 0,
    maxHeight: 220,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.safeH,
    paddingVertical: spacing.xs,
  },
  card: {
    width: 200,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.md,
    borderRadius: spacing.radiusLg,
    overflow: 'hidden',
  },
  addCard: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gold,
  },
  addIcon: {
    fontSize: 40,
    lineHeight: 48,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: spacing.radiusLg,
  },
  avatar: {
    fontSize: 44,
    lineHeight: 52,
  },
  childName: {
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modalCard: {
    width: 620,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.radiusLg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  fieldTile: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 60,
  },
  pickerTile: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    color: colors.textDim,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: colors.gold,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.surfaceHigh,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
