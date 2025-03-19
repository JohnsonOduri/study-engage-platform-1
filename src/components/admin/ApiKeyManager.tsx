
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ApiKeyManager = () => {
  const { user, isAuthenticated } = useAuth();
  const [apiKeys, setApiKeys] = useState<{id: string, service_name: string, api_key: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState<{[key: string]: boolean}>({});
  const [newApiKey, setNewApiKey] = useState("");
  const [serviceName, setServiceName] = useState("deepseek");
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchApiKeys();
    }
  }, [isAuthenticated, user]);
  
  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, service_name, api_key')
        .eq('user_id', user?.id);
        
      if (error) {
        throw error;
      }
      
      setApiKeys(data || []);
    } catch (error: any) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveApiKey = async () => {
    if (!newApiKey.trim()) {
      toast.error("API key cannot be empty");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const existingKey = apiKeys.find(key => key.service_name === serviceName);
      
      if (existingKey) {
        // Update existing key
        const { error } = await supabase
          .from('api_keys')
          .update({ 
            api_key: newApiKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingKey.id);
          
        if (error) throw error;
        toast.success(`${serviceName === 'deepseek' ? 'DeepSeek' : serviceName.toUpperCase()} API key updated successfully`);
      } else {
        // Insert new key
        const { error } = await supabase
          .from('api_keys')
          .insert({
            user_id: user?.id,
            service_name: serviceName,
            api_key: newApiKey
          });
          
        if (error) throw error;
        toast.success(`${serviceName === 'deepseek' ? 'DeepSeek' : serviceName.toUpperCase()} API key saved successfully`);
      }
      
      setNewApiKey("");
      fetchApiKeys();

      // Set environment variable in Supabase
      const { error: functionError } = await supabase.functions.invoke('update-deepseek-key', {
        body: { apiKey: newApiKey }
      });

      if (functionError) {
        console.error("Error updating environment variable:", functionError);
      }
    } catch (error: any) {
      console.error("Error saving API key:", error);
      toast.error(error.message || "Failed to save API key");
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteApiKey = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("API key deleted successfully");
      fetchApiKeys();
    } catch (error: any) {
      console.error("Error deleting API key:", error);
      toast.error(error.message || "Failed to delete API key");
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowKey = (id: string) => {
    setShowKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please login to manage API keys</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            <CardTitle>API Key Manager</CardTitle>
          </div>
          <CardDescription>
            Manage your API keys for various services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKeyInput">Add or Update API Key</Label>
            <div className="flex gap-2">
              <Select value={serviceName} onValueChange={setServiceName}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek">DeepSeek</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="apiKeyInput"
                type="password"
                placeholder="Enter API key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveApiKey} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Saved API Keys</h3>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : apiKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No API keys saved yet</p>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{key.service_name === 'deepseek' ? 'DeepSeek' : key.service_name.toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {showKey[key.id] ? key.api_key : '•'.repeat(Math.min(20, key.api_key.length))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleShowKey(key.id)}
                      >
                        {showKey[key.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete API Key</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this {key.service_name === 'deepseek' ? 'DeepSeek' : key.service_name.toUpperCase()} API key? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>Cancel</Button>
                            <Button variant="destructive" onClick={() => deleteApiKey(key.id)}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            Your API keys are encrypted and stored securely. We never share your keys with third parties.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
