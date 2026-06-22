import { useEffect, useState } from 'react';
import { getUsers, updateRole, banUser, unbanUser } from '../../services/adminService';
import { showToast } from '../../components/ui';
import Spinner from '../../components/ui/Spinner';

export default function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmName, setConfirmName] = useState('');

  const getErrorMessage = (err) => {
    return err?.response?.data?.message || err?.message || String(err);
  };

  const fetchUserList = () => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res?.users || []);
      })
      .catch((err) => {
        showToast(getErrorMessage(err) || 'Failed to load users', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    updateRole(userId, newRole)
      .then(() => {
        showToast(`Role updated to ${newRole}`, 'success');
        fetchUserList();
      })
      .catch((err) => {
        showToast(getErrorMessage(err) || 'Failed to update role', 'error');
      });
  };

  const handleOpenBanModal = (user) => {
    setSelectedUser(user);
    setConfirmName('');
    setBanModalOpen(true);
  };

  const handleConfirmBan = () => {
    if (!selectedUser) return;
    banUser(selectedUser._id)
      .then(() => {
        showToast(`User ${selectedUser.name} has been banned`, 'success');
        setBanModalOpen(false);
        fetchUserList();
      })
      .catch((err) => {
        showToast(getErrorMessage(err) || 'Failed to ban user', 'error');
      });
  };

  const handleUnban = (user) => {
    unbanUser(user._id)
      .then(() => {
        showToast(`User ${user.name} has been unbanned`, 'success');
        fetchUserList();
      })
      .catch((err) => {
        showToast(getErrorMessage(err) || 'Failed to unban user', 'error');
      });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u._id?.toLowerCase().includes(query)
    );
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg overflow-hidden relative">
      <div className="p-4 border-b border-border-default bg-bg-deep flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px] text-gold-primary">group</span>
          User Administration
        </h3>
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Search Input Bar */}
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="bg-bg-base border border-border-default rounded pl-8 pr-3 py-1 text-[11px] text-text-primary focus:outline-none focus:border-gold-primary font-mono w-full sm:w-48 placeholder:text-text-tertiary/65"
            />
          </div>
          <span className="font-mono text-[10px] text-text-tertiary whitespace-nowrap">
            {filteredUsers.length} of {users.length} accounts
          </span>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-[12px] text-text-tertiary">No users found</div>
        ) : (
          <table className="w-full text-left border-collapse text-[12px] font-ui">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-deep text-text-secondary font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-bg-elevated/40 transition-colors group">
                  <td className="p-3 pl-4 flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-border-strong border border-border-default flex items-center justify-center text-[10px] font-bold text-gold-primary font-mono select-none">
                      {getInitials(u.name)}
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block">{u.name}</span>
                      <span className="text-[10px] text-text-tertiary font-mono">ID: {u._id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-text-secondary">{u.email}</td>
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-bg-elevated border border-border-default text-text-primary px-2 py-0.5 rounded text-[11px] font-mono focus:outline-none focus:border-gold-primary cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {u.isBanned ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-data-negative/10 border border-data-negative/30 text-data-negative">
                        <span className="w-1.5 h-1.5 rounded-full bg-data-negative" />
                        Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-data-positive/10 border border-data-positive/30 text-data-positive">
                        <span className="w-1.5 h-1.5 rounded-full bg-data-positive animate-pulse-dot" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-text-secondary">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3 text-right pr-4">
                    {u.isBanned ? (
                      <button
                        onClick={() => handleUnban(u)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors bg-data-positive text-[#0e0e11] hover:bg-data-positive/90"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenBanModal(u)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors bg-data-negative/10 border border-data-negative/30 text-data-negative hover:bg-data-negative hover:text-[#0e0e11]"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Ban Confirmation Modal */}
      {banModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
          <div className="bg-bg-surface border border-border-strong rounded-lg w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 border-b border-border-default bg-bg-deep flex justify-between items-center">
              <span className="font-ui text-[12px] font-bold text-data-negative uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Confirm Ban Action
              </span>
              <button
                onClick={() => setBanModalOpen(false)}
                className="text-text-tertiary hover:text-text-primary text-[18px] font-bold cursor-pointer select-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Are you sure you want to ban <strong className="text-text-primary">{selectedUser?.name}</strong>? 
                This will prevent them from accessing their account.
              </p>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Type username <strong className="text-text-primary font-mono">"{selectedUser?.name}"</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder="Enter name exactly"
                  className="w-full bg-bg-base border border-border-default rounded px-3 py-2 text-[12px] text-text-primary focus:outline-none focus:border-data-negative font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-bg-deep border-t border-border-default flex justify-end gap-3">
              <button
                onClick={() => setBanModalOpen(false)}
                className="px-4 py-2 text-[12px] font-bold text-text-secondary border border-border-default rounded hover:bg-bg-elevated cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBan}
                disabled={confirmName !== selectedUser?.name}
                className="px-4 py-2 text-[12px] font-bold rounded bg-data-negative text-[#0e0e11] hover:bg-data-negative/90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
